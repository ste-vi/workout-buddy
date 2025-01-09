import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, of, Subject, from, forkJoin, throwError} from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { PageResponse } from '../../models/page-response';
import { BodyPart, Exercise, ExerciseCategory } from '../../models/exercise';
import { environment } from '../../../environments/environment';
import { IndexedDBService } from '../offline/indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private apiUrl = `${environment.apiUrl}/exercises`;
  private dataChangedSubject = new Subject<void>();
  dataChanged$ = this.dataChangedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private indexedDBService: IndexedDBService,
  ) {}

  searchExercises(
    page: number,
    size: number,
    query: string,
    bodyPart?: BodyPart,
    category?: ExerciseCategory,
    excludeExercisesIds?: number[],
  ): Observable<PageResponse<Exercise>> {
    if (navigator.onLine) {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

      if (query) {
        params = params.set('query', query);
      }
      if (bodyPart) {
        params = params.set('bodyPart', bodyPart);
      }
      if (category) {
        params = params.set('category', category);
      }
      if (excludeExercisesIds?.length)
        params = params.set(
          'excludeExercisesIds',
          excludeExercisesIds.join(','),
        );

      return this.http
        .get<PageResponse<Exercise>>(`${this.apiUrl}/search`, { params })
        .pipe(
          tap((response) => {
            response.content.forEach((exercise) => {
              exercise.synced = true;
              this.indexedDBService.put('exercises', exercise);
            });
          }),
          catchError((error) => {
            console.error('Error fetching exercises from API:', error);
            return this.getOfflineExercises(
              page,
              size,
              query,
              bodyPart,
              category,
              excludeExercisesIds,
            );
          }),
        );
    } else {
      return this.getOfflineExercises(
        page,
        size,
        query,
        bodyPart,
        category,
        excludeExercisesIds,
      );
    }
  }

  deleteExercise(id: number): Observable<void> {
    if (navigator.onLine) {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        tap(() => {
          this.indexedDBService.delete('exercises', id);
          this.notifyDataChanged();
        }),
        catchError((error) => {
          console.error('Error deleting exercise on API:', error);
          return this.deleteOfflineExercise(id);
        }),
      );
    } else {
      return this.deleteOfflineExercise(id);
    }
  }

  createExercise(
    name: string,
    bodyPart: BodyPart,
    category: ExerciseCategory,
  ): Observable<Exercise> {
    if (!navigator.onLine) {
      return throwError(() => new Error('Cannot create exercises while offline'));
    }

    const newExercise: Exercise = {
      id: undefined,
      name,
      sets: [],
      bodyPart,
      category,
      synced: false,
    };

    return this.http.post<Exercise>(this.apiUrl, newExercise).pipe(
      tap((createdExercise) => {
        createdExercise.synced = true;
        this.indexedDBService.put('exercises', createdExercise);
        this.notifyDataChanged();
      }),
      catchError((error) => {
        console.error('Error creating exercise on API:', error);
        return throwError(() => new Error('Failed to create exercise'));
      }),
    );
  }

  updateExercise(
    id: number,
    name: string,
    bodyPart: BodyPart,
    category: ExerciseCategory,
  ): Observable<Exercise> {
    const updatedExercise: Exercise = {
      id,
      name,
      sets: [],
      bodyPart,
      category,
      synced: false,
    };
    if (navigator.onLine) {
      return this.http
        .put<Exercise>(`${this.apiUrl}/${id}`, updatedExercise)
        .pipe(
          tap((exercise) => {
            exercise.synced = true;
            this.indexedDBService.put('exercises', exercise);
            this.notifyDataChanged();
          }),
          catchError((error) => {
            console.error('Error updating exercise on API:', error);
            return this.updateOfflineExercise(updatedExercise);
          }),
        );
    } else {
      return this.updateOfflineExercise(updatedExercise);
    }
  }

  getCategories(): Observable<ExerciseCategory[]> {
    return of(Object.values(ExerciseCategory));
  }

  getBodyParts(): Observable<BodyPart[]> {
    return of(Object.values(BodyPart));
  }

  syncWithBackend(): Observable<void> {
    if (!navigator.onLine) {
      console.log('Cannot sync with backend: offline');
      return of(void 0);
    }

    return from(this.indexedDBService.getAll('exercises')).pipe(
      switchMap((localExercises) => {
        const syncOperations: Observable<any>[] = [];

        localExercises.forEach((exercise) => {
          if (!exercise.synced) {
            if (exercise.id && exercise.id > 0) {
              syncOperations.push(
                this.http
                  .put<Exercise>(`${this.apiUrl}/${exercise.id}`, exercise)
                  .pipe(
                    tap((updatedExercise) => {
                      updatedExercise.synced = true;
                      this.indexedDBService.put('exercises', updatedExercise);
                    }),
                  ),
              );
            } else {
              syncOperations.push(
                this.http.post<Exercise>(this.apiUrl, exercise).pipe(
                  tap((newExercise) => {
                    newExercise.synced = true;
                    this.indexedDBService.put('exercises', newExercise);
                  }),
                ),
              );
            }
          }
        });

        return forkJoin(syncOperations);
      }),
      map(() => void 0),
    );
  }

  private getOfflineExercises(
    page: number,
    size: number,
    query: string,
    bodyPart?: BodyPart,
    category?: ExerciseCategory,
    excludeExercisesIds?: number[],
  ): Observable<PageResponse<Exercise>> {
    return from(this.indexedDBService.getAll('exercises')).pipe(
      map((exercises) => {
        let filteredExercises = exercises;
        if (query) {
          filteredExercises = filteredExercises.filter((e) =>
            e.name.toLowerCase().includes(query.toLowerCase()),
          );
        }

        if (bodyPart) {
          filteredExercises = filteredExercises.filter(
            (e) => e.bodyPart === bodyPart,
          );
        }

        if (category) {
          filteredExercises = filteredExercises.filter(
            (e) => e.category === category,
          );
        }

        if (excludeExercisesIds?.length) {
          filteredExercises = filteredExercises.filter(
            (e) => !excludeExercisesIds.includes(e.id),
          );
        }

        const paginatedExercises = this.paginateExercises(
          filteredExercises,
          page,
          size,
        );
        return {
          content: paginatedExercises,
          totalElements: filteredExercises.length,
          totalPages: Math.ceil(filteredExercises.length / size),
          pageNumber: page,
          pageSize: size,
          last: (page + 1) * size >= filteredExercises.length,
        };
      }),
    );
  }

  private deleteOfflineExercise(id: number): Observable<void> {
    return from(this.indexedDBService.delete('exercises', id)).pipe(
      tap(() => this.notifyDataChanged()),
      map(() => void 0),
    );
  }

  private createOfflineExercise(exercise: Exercise): Observable<Exercise> {
    return from(this.indexedDBService.add('exercises', exercise)).pipe(
      tap(() => this.notifyDataChanged()),
      map(() => exercise),
    );
  }

  private updateOfflineExercise(exercise: Exercise): Observable<Exercise> {
    return from(this.indexedDBService.put('exercises', exercise)).pipe(
      tap(() => this.notifyDataChanged()),
      map(() => exercise),
    );
  }

  private paginateExercises(
    exercises: Exercise[],
    page: number,
    size: number,
  ): Exercise[] {
    const startIndex = page * size;
    return exercises.slice(startIndex, startIndex + size);
  }

  private notifyDataChanged(): void {
    this.dataChangedSubject.next();
  }
}
