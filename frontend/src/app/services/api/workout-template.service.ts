import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkoutTemplatePreview } from '../../models/workout-template-preview';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkoutTemplateService {
  private apiUrl = `${environment.apiUrl}/workout-templates`;
  private workoutTemplatesSubject = new BehaviorSubject<WorkoutTemplate[]>([]);
  private workoutTemplatePreviewsSubject = new BehaviorSubject<WorkoutTemplatePreview[]>([]);
  private suggestedWorkoutTemplateSubject = new BehaviorSubject<WorkoutTemplate | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.refreshData();
  }

  private refreshData() {
    this.getWorkoutTemplatesFromApi().subscribe();
    this.getWorkoutTemplatePreviewsFromApi().subscribe();
    this.getSuggestedWorkoutTemplateFromApi().subscribe();
  }

  getSuggestedWorkoutTemplate(): Observable<WorkoutTemplate | undefined> {
    return this.suggestedWorkoutTemplateSubject.asObservable();
  }

  getWorkoutTemplates(): Observable<WorkoutTemplate[]> {
    return this.workoutTemplatesSubject.asObservable();
  }

  getWorkoutTemplatePreviews(): Observable<WorkoutTemplatePreview[]> {
    return this.workoutTemplatePreviewsSubject.asObservable();
  }

  private getWorkoutTemplatesFromApi(): Observable<WorkoutTemplate[]> {
    return this.http
      .get<WorkoutTemplate[]>(this.apiUrl)
      .pipe(tap((templates) => this.workoutTemplatesSubject.next(templates)));
  }

  private getSuggestedWorkoutTemplateFromApi(): Observable<WorkoutTemplate> {
    return this.http
      .get<WorkoutTemplate>(`${this.apiUrl}/suggested`)
      .pipe(
        tap((template) => this.suggestedWorkoutTemplateSubject.next(template)),
      );
  }

  private getWorkoutTemplatePreviewsFromApi(): Observable<WorkoutTemplatePreview[]> {
    return this.http
      .get<WorkoutTemplatePreview[]>(`${this.apiUrl}/previews`)
      .pipe(
        tap((previews) => this.workoutTemplatePreviewsSubject.next(previews)),
      );
  }

  createWorkoutTemplate(
    workoutTemplate: WorkoutTemplate,
  ): Observable<void> {
    return this.http
      .post<void>(this.apiUrl, workoutTemplate)
      .pipe(tap(() => this.refreshData()));
  }

  updateWorkoutTemplate(
    workoutTemplate: WorkoutTemplate,
  ): Observable<void> {
    return this.http
      .put<void>(
        `${this.apiUrl}/${workoutTemplate.id}`,
        workoutTemplate,
      )
      .pipe(tap(() => this.refreshData()));
  }

  updateWorkoutTemplateFromWorkout(
    workoutTemplate: WorkoutTemplate,
  ): Observable<void> {
    return this.http
      .put<void>(
        `${this.apiUrl}/${workoutTemplate.id}/workout`,
        workoutTemplate,
      )
      .pipe(tap(() => this.refreshData()));
  }

  archiveWorkoutTemplate(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}/archive`)
      .pipe(tap(() => this.refreshData()));
  }

  unarchiveWorkoutTemplate(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}/unarchive`)
      .pipe(tap(() => this.refreshData()));
  }
}
