import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { workoutHistory } from './dummy-data/workout-histories-dummy-data';
import { WorkoutHistory } from '../../models/workout-history';
import { PageResponse } from '../../models/page-response';

@Injectable({
  providedIn: 'root',
})
export class WorkoutHistoryService {
  constructor() {}

  searchWorkoutHistory(
    page: number,
    size: number,
    dateFrom?: Date,
    dateTo?: Date,
    searchQuery?: string,
  ): Observable<PageResponse<WorkoutHistory>> {
    const filteredWorkoutHistory = workoutHistory.filter(
      (workout) =>
        (!dateFrom || workout.date >= dateFrom) &&
        (!dateTo || workout.date <= dateTo) &&
        (!searchQuery ||
          workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workout.duration.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    const totalElements = filteredWorkoutHistory.length;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedWorkoutHistory = filteredWorkoutHistory.slice(
      startIndex,
      endIndex,
    );

    return of({
      content: paginatedWorkoutHistory,
      pageNumber: page,
      pageSize: size,
      totalPages: Math.ceil(totalElements / size),
      totalElements: totalElements,
      last: (page + 1) * size >= totalElements,
    });
  }
}
