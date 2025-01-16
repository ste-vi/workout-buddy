import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkoutTemplate } from '../../models/workout-template';
import {Observable, of} from 'rxjs';
import { environment } from '../../../environments/environment';
import {WorkoutTemplatePreview} from "../../models/workout-template-preview";

@Injectable({
  providedIn: 'root',
})
export class WorkoutTemplateService {
  private apiUrl = `${environment.apiUrl}/workout-templates`;

  constructor(private http: HttpClient) {}

  getSuggestedWorkoutTemplate(): Observable<WorkoutTemplate> {
    return this.http.get<WorkoutTemplate>(`${this.apiUrl}/suggested`);
  }

  getWorkoutTemplates(): Observable<WorkoutTemplate[]> {
    return this.http.get<WorkoutTemplate[]>(this.apiUrl);
  }

  getWorkoutTemplatePreviews(): Observable<WorkoutTemplatePreview[]> {
    return this.http.get<WorkoutTemplatePreview[]>(`${this.apiUrl}/previews`);
  }

  createWorkoutTemplate(workoutTemplate: WorkoutTemplate): Observable<WorkoutTemplate> {
    return this.http.post<WorkoutTemplate>(this.apiUrl, workoutTemplate);
  }

  updateWorkoutTemplate(workoutTemplate: WorkoutTemplate): Observable<WorkoutTemplate> {
    return this.http.put<WorkoutTemplate>(`${this.apiUrl}/${workoutTemplate.id}`, workoutTemplate);
  }

  archiveWorkoutTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/archive`);
  }

  unarchiveWorkoutTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/unarchive`);
  }
}
