import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BodyWeightMeasure } from '../../models/body-weight-measure';
import { PageResponse } from '../../models/page-response';
import { bodyWightMeasures } from './dummy-data/body-weight-dummy-data';
import {SortOrder} from "../../models/sort-order";

@Injectable({
  providedIn: 'root',
})
export class BodyWeightService {
  constructor() {}

  getLast5BodyWeightMeasures(): Observable<BodyWeightMeasure[]> {
    let measures: BodyWeightMeasure[] = [
      {
        date: new Date('2024-08-19'),
        value: 89,
      },
      {
        date: new Date('2024-09-19'),
        value: 90,
      },
      {
        date: new Date('2024-09-21'),
        value: 91,
      },
      {
        date: new Date('2024-09-25'),
        value: 93,
      },
      {
        date: new Date('2024-09-30'),
        value: 99,
      },
    ];

    return of(measures);
  }

  searchBodyWeightMeasures(
    page: number,
    size: number,
    dateFrom: Date,
    dateTo: Date,
    sortOrder: SortOrder
  ): Observable<PageResponse<BodyWeightMeasure>> {
    const start = page * size;
    const end = start + size;

    let filteredBodyWightMeasures = bodyWightMeasures;

    if (dateFrom && dateTo) {
      filteredBodyWightMeasures = filteredBodyWightMeasures.filter(
        (measure) => measure.date >= dateFrom && measure.date <= dateTo,
      );
    }

    filteredBodyWightMeasures = filteredBodyWightMeasures.sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime() // Ascending order
        : new Date(b.date).getTime() - new Date(a.date).getTime() // Descending order
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


}
