import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, from, of, forkJoin } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { BodyWeightMeasure } from '../../models/body-weight-measure';
import { PageResponse } from '../../models/page-response';
import { SortOrder } from '../../models/sort-order';
import { environment } from '../../../environments/environment';
import { IndexedDBService } from '../offline/indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class BodyWeightService {
  private apiUrl = `${environment.apiUrl}/api/body-weight-measures`;
  private dataChangedSubject = new Subject<void>();
  dataChanged$ = this.dataChangedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private indexedDBService: IndexedDBService,
  ) {}

  searchBodyWeightMeasures(
    page: number,
    size: number,
    sortOrder: SortOrder,
    dateFrom?: Date,
    dateTo?: Date,
  ): Observable<PageResponse<BodyWeightMeasure>> {
    if (navigator.onLine) {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sortOrder', sortOrder);

      if (dateFrom) {
        params = params.set('dateFrom', dateFrom.toISOString());
      }
      if (dateTo) {
        params = params.set('dateTo', dateTo.toISOString());
      }

      return this.http
        .get<
          PageResponse<BodyWeightMeasure>
        >(`${this.apiUrl}/search`, { params })
        .pipe(
          tap((response) => {
            // Update IndexedDB with the fetched data
            response.content.forEach((measure) => {
              measure.synced = true;
              this.indexedDBService.put('bodyWeightMeasures', measure);
            });
          }),
          catchError((error) => {
            console.error('Error fetching measures from API:', error);
            return this.getOfflineBodyWeightMeasures(
              page,
              size,
              sortOrder,
              dateFrom,
              dateTo,
            );
          }),
        );
    } else {
      return this.getOfflineBodyWeightMeasures(
        page,
        size,
        sortOrder,
        dateFrom,
        dateTo,
      );
    }
  }

  private getOfflineBodyWeightMeasures(
    page: number,
    size: number,
    sortOrder: SortOrder,
    dateFrom?: Date,
    dateTo?: Date,
  ): Observable<PageResponse<BodyWeightMeasure>> {
    return from(this.indexedDBService.getAll('bodyWeightMeasures')).pipe(
      map((measures) => {
        let filteredMeasures = measures;
        if (dateFrom) {
          filteredMeasures = filteredMeasures.filter(
            (m) => new Date(m.date) >= dateFrom,
          );
        }
        if (dateTo) {
          filteredMeasures = filteredMeasures.filter(
            (m) => new Date(m.date) <= dateTo,
          );
        }
        const sortedMeasures = this.sortMeasures(filteredMeasures, sortOrder);
        const paginatedMeasures = this.paginateMeasures(
          sortedMeasures,
          page,
          size,
        );
        return {
          content: paginatedMeasures,
          totalElements: filteredMeasures.length,
          totalPages: Math.ceil(filteredMeasures.length / size),
          pageNumber: page,
          pageSize: size,
          last: (page + 1) * size >= filteredMeasures.length,
        };
      }),
    );
  }

  getLast5BodyWeightMeasures(): Observable<BodyWeightMeasure[]> {
    if (navigator.onLine) {
      return this.http.get<BodyWeightMeasure[]>(`${this.apiUrl}/last-5`).pipe(
        tap((measures) => {
          measures.forEach((measure) => {
            measure.synced = true;
            this.indexedDBService.put('bodyWeightMeasures', measure);
          });
        }),
        catchError((error) => {
          console.error('Error fetching last 5 measures from API:', error);
          return this.getOfflineLast5BodyWeightMeasures();
        }),
      );
    } else {
      return this.getOfflineLast5BodyWeightMeasures();
    }
  }

  private getOfflineLast5BodyWeightMeasures(): Observable<BodyWeightMeasure[]> {
    return from(this.indexedDBService.getAll('bodyWeightMeasures')).pipe(
      map((measures) =>
        this.sortMeasures(measures, SortOrder.DESC).slice(0, 5),
      ),
    );
  }

  updateBodyWeightMeasure(
    bodyWeightMeasure: BodyWeightMeasure,
  ): Observable<BodyWeightMeasure> {
    if (navigator.onLine) {
      return this.http
        .put<BodyWeightMeasure>(
          `${this.apiUrl}/${bodyWeightMeasure.id}`,
          bodyWeightMeasure,
        )
        .pipe(
          tap((updatedMeasure) => {
            updatedMeasure.synced = true;
            this.indexedDBService.put('bodyWeightMeasures', updatedMeasure);
            this.notifyDataChanged();
          }),
          catchError((error) => {
            console.error('Error updating measure on API:', error);
            return this.updateOfflineBodyWeightMeasure(bodyWeightMeasure);
          }),
        );
    } else {
      return this.updateOfflineBodyWeightMeasure(bodyWeightMeasure);
    }
  }

  private updateOfflineBodyWeightMeasure(
    bodyWeightMeasure: BodyWeightMeasure,
  ): Observable<BodyWeightMeasure> {
    bodyWeightMeasure.synced = false;
    return from(
      this.indexedDBService.put('bodyWeightMeasures', bodyWeightMeasure),
    ).pipe(
      map(() => bodyWeightMeasure),
      tap(() => this.notifyDataChanged()),
    );
  }

  addBodyWeightMeasure(weight: number): Observable<BodyWeightMeasure> {
    const measure: BodyWeightMeasure = {
      value: weight,
      date: new Date(),
      synced: false,
    };

    if (navigator.onLine) {
      return this.http.post<BodyWeightMeasure>(this.apiUrl, measure).pipe(
        tap((newMeasure) => {
          newMeasure.synced = true;
          this.indexedDBService.add('bodyWeightMeasures', newMeasure);
          this.notifyDataChanged();
        }),
        catchError((error) => {
          console.error('Error adding measure on API:', error);
          return this.addOfflineBodyWeightMeasure(measure);
        }),
      );
    } else {
      return this.addOfflineBodyWeightMeasure(measure);
    }
  }

  private addOfflineBodyWeightMeasure(
    measure: BodyWeightMeasure,
  ): Observable<BodyWeightMeasure> {
    measure.id = -Date.now();
    return from(this.indexedDBService.add('bodyWeightMeasures', measure)).pipe(
      map(() => measure),
      tap(() => this.notifyDataChanged()),
    );
  }

  deleteBodyWeightMeasure(id: number): Observable<void> {
    if (navigator.onLine) {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        tap(() => {
          this.indexedDBService.delete('bodyWeightMeasures', id);
          this.notifyDataChanged();
        }),
        catchError((error) => {
          console.error('Error deleting measure on API:', error);
          return this.deleteOfflineBodyWeightMeasure(id);
        }),
      );
    } else {
      return this.deleteOfflineBodyWeightMeasure(id);
    }
  }

  private deleteOfflineBodyWeightMeasure(id: number): Observable<void> {
    return from(this.indexedDBService.delete('bodyWeightMeasures', id)).pipe(
      tap(() => this.notifyDataChanged()),
    );
  }

  syncWithBackend(): Observable<void> {
    if (!navigator.onLine) {
      console.log('Cannot sync with backend: offline');
      return of(void 0);
    }

    return from(this.indexedDBService.getAll('bodyWeightMeasures')).pipe(
      switchMap((localMeasures) => {
        const syncOperations: Observable<any>[] = [];

        localMeasures.forEach((measure) => {
          if (!measure.synced) {
            if (measure.id && measure.id > 0) {
              syncOperations.push(
                this.http
                  .put<BodyWeightMeasure>(
                    `${this.apiUrl}/${measure.id}`,
                    measure,
                  )
                  .pipe(
                    tap((updatedMeasure) => {
                      updatedMeasure.synced = true;
                      this.indexedDBService.put(
                        'bodyWeightMeasures',
                        updatedMeasure,
                      );
                    }),
                    catchError((error) => {
                      console.error('Error syncing update:', error);
                      return of(null);
                    }),
                  ),
              );
            } else {
              // Add new measure
              syncOperations.push(
                this.http.post<BodyWeightMeasure>(this.apiUrl, measure).pipe(
                  tap((newMeasure) => {
                    this.indexedDBService.delete(
                      'bodyWeightMeasures',
                      measure.id,
                    );
                    newMeasure.synced = true;
                    this.indexedDBService.add('bodyWeightMeasures', newMeasure);
                  }),
                  catchError((error) => {
                    console.error('Error syncing new measure:', error);
                    return of(null);
                  }),
                ),
              );
            }
          }
        });

        syncOperations.push(
          this.http
            .get<PageResponse<BodyWeightMeasure>>(`${this.apiUrl}/search`, {
              params: new HttpParams()
                .set('page', '0')
                .set('size', '50')
                .set('sortOrder', SortOrder.DESC),
            })
            .pipe(
              tap((response) => {
                response.content.forEach((measure) => {
                  measure.synced = true;
                  this.indexedDBService.put('bodyWeightMeasures', measure);
                });
              }),
              catchError((error) => {
                console.error('Error fetching latest measures:', error);
                return of(null);
              }),
            ),
        );

        return forkJoin(syncOperations);
      }),
      map(() => {
        this.notifyDataChanged();
      }),
    );
  }

  getOfflineLatestMeasure(): Observable<BodyWeightMeasure | undefined> {
    return from(this.indexedDBService.getAll('bodyWeightMeasures')).pipe(
      map((measures) => {
        return measures.length > 0 ? measures[measures.length - 1] : undefined;
      }),
    );
  }

  private notifyDataChanged(): void {
    this.dataChangedSubject.next();
  }

  private sortMeasures(
    measures: BodyWeightMeasure[],
    sortOrder: SortOrder,
  ): BodyWeightMeasure[] {
    return measures.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === SortOrder.ASC ? dateA - dateB : dateB - dateA;
    });
  }

  private paginateMeasures(
    measures: BodyWeightMeasure[],
    page: number,
    size: number,
  ): BodyWeightMeasure[] {
    const start = page * size;
    const end = start + size;
    return measures.slice(start, end);
  }
}
