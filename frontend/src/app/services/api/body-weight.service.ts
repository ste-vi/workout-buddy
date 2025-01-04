import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { BodyWeightMeasure } from '../../models/body-weight-measure';
import { PageResponse } from '../../models/page-response';
import { bodyWightMeasures } from './dummy-data/body-weight-dummy-data';
import { SortOrder } from '../../models/sort-order';

@Injectable({
  providedIn: 'root',
})
export class BodyWeightService {
  private dataChangedSubject = new Subject<void>();
  dataChanged$ = this.dataChangedSubject.asObservable();

  constructor() {}

  getLast5BodyWeightMeasures(): Observable<BodyWeightMeasure[]> {
    return of(bodyWightMeasures.slice(0, 5));
  }

  searchBodyWeightMeasures(
    page: number,
    size: number,
    dateFrom: Date,
    dateTo: Date,
    sortOrder: SortOrder,
  ): Observable<PageResponse<BodyWeightMeasure>> {
    const start = page * size;
    const end = start + size;

    let filteredBodyWightMeasures = bodyWightMeasures;

    if (dateFrom && dateTo) {
      filteredBodyWightMeasures = filteredBodyWightMeasures.filter(
        (measure) => measure.date >= dateFrom && measure.date <= dateTo,
      );
    }

    filteredBodyWightMeasures = filteredBodyWightMeasures.sort(
      (a, b) =>
        sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime() // Ascending order
          : new Date(b.date).getTime() - new Date(a.date).getTime(), // Descending order
    );

    const paginatedExercises = filteredBodyWightMeasures.slice(start, end);

    return of({
      content: paginatedExercises,
      pageNumber: page,
      pageSize: size,
      totalPages: Math.ceil(filteredBodyWightMeasures.length / size),
      totalElements: filteredBodyWightMeasures.length,
      last: end >= filteredBodyWightMeasures.length,
    });
  }

  updateBodyWeight(
    bodyWeightMeasure: BodyWeightMeasure,
  ): Observable<BodyWeightMeasure> {
    return of(bodyWeightMeasure);
  }

  addBodyWeight(weight: number): Observable<BodyWeightMeasure> {
    let measure: BodyWeightMeasure = {
      id: 12345,
      date: new Date(),
      value: weight,
    };
    bodyWightMeasures.unshift(measure);
    this.notifyDataChanged();
    return of(measure);
  }

  private notifyDataChanged(): void {
    this.dataChangedSubject.next();
  }

  deleteBodyWeightMeasure(id: number): Observable<void> {
    const index = bodyWightMeasures.findIndex((measure) => measure.id === id);
    if (index !== -1) {
      bodyWightMeasures.splice(index, 1);
      this.notifyDataChanged();
      return of(undefined);
    } else {
      return throwError(() => new Error('Measure not found'));
    }
  }
}
