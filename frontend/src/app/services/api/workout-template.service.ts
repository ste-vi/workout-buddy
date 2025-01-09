import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  createWorkoutTemplate(workoutTemplate: WorkoutTemplate): Observable<WorkoutTemplate> {
    return this.http.post<WorkoutTemplate>(this.apiUrl, workoutTemplate);
  }

  updateWorkoutTemplate(workoutTemplate: WorkoutTemplate): Observable<WorkoutTemplate> {
    return this.http.put<WorkoutTemplate>(`${this.apiUrl}/${workoutTemplate.id}`, workoutTemplate);
  }

  deleteWorkoutTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
