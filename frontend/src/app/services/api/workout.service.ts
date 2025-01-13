import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workout } from '../../models/workout';
import { PageResponse } from '../../models/page-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Tag } from '../../models/tag';
import { Sets } from '../../models/set';

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

  getLastPerformedWorkout(): Observable<Workout | undefined> {
    return this.http.get<Workout | undefined>(`${this.apiUrl}/latest`);
  }

  deleteWorkout(workoutId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${workoutId}`);
  }

  resetTimer(workoutId: number): Observable<Date> {
    return this.http.delete<Date>(`${this.apiUrl}/ongoing/${workoutId}/timer`);
  }

  addExerciseToWorkout(
    workoutId: number,
    exercisesPositions: { id: number; position: number }[],
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${workoutId}/exercises`,
      exercisesPositions,
    );
  }

  replaceExercise(
    workoutId: number,
    exerciseId: number,
    newExerciseId?: number,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${workoutId}/exercises/replace?exerciseId=${exerciseId}&newExerciseId=${newExerciseId}`,
      {},
    );
  }

  removeExercise(exerciseId: number, workoutId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${workoutId}/exercises/${exerciseId}`,
    );
  }

  updateExercisesPositionForWorkout(
    workoutId: number,
    exercisesPositions: { id: number; position: number }[],
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${workoutId}/exercises/positions`,
      exercisesPositions,
    );
  }

  updateTagsForWorkout(workoutId: number, tags: Tag[]): Observable<Tag[]> {
    return this.http.put<Tag[]>(`${this.apiUrl}/${workoutId}/tags`, tags);
  }

  addSet(workoutId: number, exerciseId: number, set: Sets): Observable<Sets> {
    return this.http.post<Sets>(
      `${this.apiUrl}/${workoutId}/exercises/${exerciseId}/sets`,
      set,
    );
  }

  deleteSet(workoutId: number, setId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${workoutId}/exercises/sets/${setId}`,
    );
  }

  updateSetWeight(
    workoutId: number,
    exerciseId: number,
    setId: number,
    weight: number,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${workoutId}/exercises/${exerciseId}/sets/${setId}/weight?weight=${weight}`,
      {},
    );
  }

  updateSetReps(
    workoutId: number,
    exerciseId: number,
    setId: number,
    reps: number,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${workoutId}/exercises/${exerciseId}/sets/${setId}/reps?reps=${reps}`,
      {},
    );
  }

  completeSet(
    workoutId: number,
    exerciseId: number,
    setId: number,
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${workoutId}/exercises/${exerciseId}/sets/${setId}/complete`,
      {},
    );
  }

  completeWorkout(workoutId: number, totalWeight?: number): Observable<Date> {
    let url = `${this.apiUrl}/ongoing/${workoutId}`;
    if (totalWeight !== undefined) {
      url += `?totalWeight=${totalWeight}`;
    }
    return this.http.post<Date>(url, {});
  }

  searchWorkoutHistory(
    page: number,
    size: number,
    dateFrom?: Date,
    dateTo?: Date,
    searchQuery?: string,
  ): Observable<PageResponse<Workout>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom.toISOString().slice(0, -1));
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo.toISOString().slice(0, -1));
    }
    if (searchQuery) {
      params = params.set('searchQuery', searchQuery);
    }

    return this.http.get<PageResponse<Workout>>(`${this.apiUrl}/history`, {
      params,
    });
  }
}
