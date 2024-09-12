import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';
import { Workout } from '../../models/workout';
import { workoutHistory } from './dummy-data/workout-histories-dummy-data';
import { WorkoutHistory } from '../../models/workout-history';

@Injectable({
  providedIn: 'root',
})
export class WorkoutHistoryService {
  constructor() {}

  getWorkoutHistory(
    dateFrom: Date,
    dateTo: Date,
  ): Observable<WorkoutHistory[]> {
    return of(workoutHistory);
  }
}
