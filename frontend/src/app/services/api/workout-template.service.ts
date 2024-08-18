import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';
import {
  suggestedWorkoutTemplate,
  workoutTemplates,
} from './dummy-data/workflow-templates-dummy-daya';

@Injectable({
  providedIn: 'root',
})
export class WorkoutTemplateService {
  constructor() {}

  getSuggestedWorkoutTemplate(): Observable<WorkoutTemplate> {
    return of(suggestedWorkoutTemplate);
  }

  getWorkoutTemplates(): Observable<WorkoutTemplate[]> {
    return of(workoutTemplates);
  }

  createWorkoutTemplate(
    workoutTemplate: WorkoutTemplate,
  ): Observable<WorkoutTemplate> {
    return of(workoutTemplate);
  }

  updateWorkoutTemplate(
    workoutTemplate: WorkoutTemplate,
  ): Observable<WorkoutTemplate> {
    return of(workoutTemplate);
  }
}
