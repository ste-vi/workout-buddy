import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';
import { Workout } from '../../models/workout';
import { PageResponse } from '../../models/page-response';
import { workout } from './dummy-data/workout-histories-dummy-data';
import { BodyWeightMeasure } from '../../models/body-weight-measure';

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
}
