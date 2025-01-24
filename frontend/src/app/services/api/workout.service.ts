import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workout } from '../../models/workout';
import { PageResponse } from '../../models/page-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Tag } from '../../models/tag';
import { Sets } from '../../models/set';
import { WorkoutTemplate } from '../../models/workout-template';
import { WorkoutCompletionResponse } from '../../models/workout-completion-response';
import { WorkoutTemplatePreview } from '../../models/workout-template-preview';
import { tap } from 'rxjs/operators';
import {WorkoutHistoryPreview} from "../../models/workout-history-preview";

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private apiUrl = `${environment.apiUrl}/workouts`;
  private lastPerformedWorkoutSubject = new BehaviorSubject<Workout | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.refreshData();
  }

  private refreshData() {
    this.getWorkoutTemplatesFromApi().subscribe();
  }

  getLastPerformedWorkout(): Observable<Workout | undefined> {
    return this.lastPerformedWorkoutSubject.asObservable();
  }

  private getWorkoutTemplatesFromApi(): Observable<Workout | undefined> {
    return this.http
      .get<Workout | undefined>(`${this.apiUrl}/latest`)
      .pipe(tap((workout) => this.lastPerformedWorkoutSubject.next(workout)));
  }

  getOngoingWorkout(): Observable<Workout | undefined> {
    return this.http.get<Workout | undefined>(`${this.apiUrl}/ongoing`);
  }

  getWorkoutById(workoutId: number): Observable<Workout> {
    return this.http.get<Workout>(`${this.apiUrl}/${workoutId}`);
  }

  updateWorkout(workout: Workout): Observable<Workout> {
    return this.http.put<Workout>(`${this.apiUrl}/${workout.id}`, workout)
      .pipe(tap(() => this.refreshData()));
  }

  deleteWorkout(workoutId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${workoutId}`);
  }

  startWorkout(workoutTemplateId: number): Observable<Workout> {
    return this.http.post<Workout>(
      `${this.apiUrl}/start/${workoutTemplateId}`,
      {},
    );
  }

  completeWorkout(
    workoutId: number,
    totalWeight?: number,
  ): Observable<WorkoutCompletionResponse> {
    let url = `${this.apiUrl}/ongoing/${workoutId}`;
    if (totalWeight !== undefined) {
      url += `?totalWeight=${totalWeight}`;
    }
    return this.http
      .post<WorkoutCompletionResponse>(url, {})
      .pipe(tap(() => this.refreshData()));
  }

  searchWorkoutHistory(
    page: number,
    size: number,
    dateFrom?: Date,
    dateTo?: Date,
    workoutTemplateId?: number,
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
    if (workoutTemplateId) {
      params = params.set('templateId', workoutTemplateId);
    }
    if (searchQuery) {
      params = params.set('searchQuery', searchQuery);
    }

    return this.http.get<PageResponse<Workout>>(`${this.apiUrl}/history`, {
      params,
    });
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

  updateNotesForExercise(workoutId: number, exerciseId: number, notes: string | null): Observable<void> {
    const url = `${this.apiUrl}/${workoutId}/exercises/${exerciseId}/notes`;
    let params = new HttpParams();
    if (notes !== null) {
      params = params.set('notes', notes);
    }
    return this.http.put<void>(url, null, { params });
  }

  getWorkoutHistoryPreviews(startDate: Date, endDate: Date): Observable<WorkoutHistoryPreview[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<WorkoutHistoryPreview[]>(`${this.apiUrl}/history-previews`, { params });
  }
}
