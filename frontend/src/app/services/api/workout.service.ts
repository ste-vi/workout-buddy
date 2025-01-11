import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Workout } from '../../models/workout';
import { PageResponse } from '../../models/page-response';
import { workout } from './dummy-data/workout-histories-dummy-data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private apiUrl = `${environment.apiUrl}/workouts`;

  constructor(private http: HttpClient) {}

  startWorkout(workoutTemplateId: number): Observable<Workout> {
    return this.http.post<Workout>(
      `${this.apiUrl}/start/${workoutTemplateId}`,
      {},
    );
  }

  getOngoingWorkout(): Observable<Workout | undefined> {
    return this.http.get<Workout | undefined>(`${this.apiUrl}/ongoing`);
  }

  deleteWorkout(workoutId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${workoutId}`);
  }

  resetTimer(workoutId: number): Observable<Date> {
    return this.http.delete<Date>(`${this.apiUrl}/ongoing/${workoutId}/timer`);
  }

  removeExercise(exerciseId: number, workoutId: number) {}

  replaceExercise(
    workoutId: number,
    exerciseId: number,
    newExerciseId?: number,
  ) {}

  updateExercisesPositionForWorkout(workoutId: number, exerciseIds: number[]) {
    // on BE just update order field in workout_exercises table based in the ids positions in list
  }

  addExerciseToWorkout(workoutId: number, exerciseIds: number[]) {}

  searchWorkoutHistory(
    page: number,
    size: number,
    dateFrom?: Date,
    dateTo?: Date,
    searchQuery?: string,
  ): Observable<PageResponse<Workout>> {
    const filteredWorkoutHistory = workout.filter(
      (workout) =>
        (!dateFrom || workout.startTime >= dateFrom) &&
        (!dateTo || workout.startTime <= dateTo) &&
        (!searchQuery ||
          workout.title.toLowerCase().includes(searchQuery.toLowerCase())),
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
