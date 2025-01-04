import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { BodyWeightMeasure } from '../../models/body-weight-measure';
import { PageResponse } from '../../models/page-response';
import { SortOrder } from '../../models/sort-order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BodyWeightService {
  private apiUrl = `${environment.apiUrl}/api/body-weight-measures`;
  private dataChangedSubject = new Subject<void>();
  dataChanged$ = this.dataChangedSubject.asObservable();

  searchBodyWeightMeasures(
    page: number,
    size: number,
    sortOrder: SortOrder,
    dateFrom?: Date,
    dateTo?: Date,
  ): Observable<PageResponse<BodyWeightMeasure>> {
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

    return this.http.get<PageResponse<BodyWeightMeasure>>(
      `${this.apiUrl}/search`,
      { params },
    );
  }

  constructor(private http: HttpClient) {}

  getLast5BodyWeightMeasures(): Observable<BodyWeightMeasure[]> {
    return this.http.get<BodyWeightMeasure[]>(`${this.apiUrl}/last-5`);
  }

  updateBodyWeight(
    bodyWeightMeasure: BodyWeightMeasure,
  ): Observable<BodyWeightMeasure> {
    return this.http
      .put<BodyWeightMeasure>(
        `${this.apiUrl}/${bodyWeightMeasure.id}`,
        bodyWeightMeasure,
      )
      .pipe(tap(() => this.notifyDataChanged()));
  }

  addBodyWeight(weight: number): Observable<BodyWeightMeasure> {
    const measure = {
      value: weight,
      date: new Date(),
    };
    return this.http
      .post<BodyWeightMeasure>(this.apiUrl, measure)
      .pipe(tap(() => this.notifyDataChanged()));
  }

  deleteBodyWeightMeasure(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.notifyDataChanged()));
  }

  private notifyDataChanged(): void {
    this.dataChangedSubject.next();
  }
}
