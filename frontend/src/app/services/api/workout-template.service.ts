import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutTemplateService {
  constructor() {}

  getSuggestedWorkoutTemplate(): Observable<WorkoutTemplate> {
    const template: WorkoutTemplate = {
      id: 1,
      name: 'High-Intensity Interval Training (HIIT)',
      description:
        'A high-intensity interval training (HIIT) workout is a cardiovascular exercise technique that combines high-intensity aerobic activities with short bursts of low-intensity activities called intervals.',
      exercises: [
        { id: 1, name: 'Squats', sets: [{ id: 1, reps: 8, weight: 135 }] },
        { id: 2, name: 'Lunges', sets: [{ id: 1, reps: 8, weight: 135 }] },
        { id: 3, name: 'Push-ups', sets: [{ id: 1, reps: 8, weight: 135 }] },
        { id: 4, name: 'Pull-ups', sets: [{ id: 1, reps: 8, weight: 135 }] },
      ],
      estimatedDuration: '30 min',
      totalSets: 4,
      lastExecutionDate: new Date('2024-07-18'),
    };

    return of(template);
  }

  getWorkoutTemplates(): Observable<WorkoutTemplate[]> {
    const template1: WorkoutTemplate = {
      id: 1,
      name: 'High-Intensity Interval Training (HIIT)',
      description:
        'A high-intensity interval training (HIIT) workout is a cardiovascular exercise technique that combines high-intensity aerobic activities with short bursts of low-intensity activities called intervals.',
      exercises: [
        { id: 1, name: 'Squats', sets: [{ id: 1, reps: 8, weight: 135 }] },
        { id: 2, name: 'Lunges', sets: [{ id: 1, reps: 8, weight: 135 }] },
        { id: 3, name: 'Push-ups', sets: [{ id: 1, reps: 8, weight: 135 }] },
        { id: 4, name: 'Pull-ups', sets: [{ id: 1, reps: 8, weight: 135 }] },
      ],
      estimatedDuration: '30 min',
      totalSets: 4,
      lastExecutionDate: new Date('2024-07-18'),
    };

    const template2: WorkoutTemplate = {
      id: 2,
      name: 'Low-Intensity Interval Training (LIIT)',
      description:
        'A low-intensity interval training (LIIT) workout is a cardiovascular exercise technique that combines low-intensity aerobic activities with short bursts of high-intensity activities called intervals.',
      exercises: [
        { id: 1, name: 'Burpees', sets: [{ id: 1, reps: 10, weight: 0 }] },
        { id: 2, name: 'Planks', sets: [{ id: 1, reps: 10, weight: 0 }] },
        {
          id: 3,
          name: 'Jumping Jacks',
          sets: [{ id: 1, reps: 10, weight: 0 }],
        },
        { id: 4, name: 'Squats', sets: [{ id: 1, reps: 10, weight: 0 }] },
      ],
      estimatedDuration: '30 min',
      totalSets: 10,
      lastExecutionDate: new Date('2024-07-24'),
    };

    const template3: WorkoutTemplate = {
      id: 3,
      name: 'Back + Biceps',
      description:
        'A high-intensity interval training (HIIT) workout with a focus on core strength is a cardiovascular exercise technique that combines high-intensity aerobic activities with short bursts of low-intensity activities called intervals, while also focusing on core strength.',
      exercises: [
        { id: 1, name: 'Push-ups', sets: [{ id: 1, reps: 12, weight: 135 }] },
        { id: 2, name: 'Pull-ups', sets: [{ id: 1, reps: 12, weight: 135 }] },
        { id: 3, name: 'Planks', sets: [{ id: 1, reps: 12, weight: 0 }] },
      ],
      estimatedDuration: '30 min',
      totalSets: 10,
      lastExecutionDate: new Date('2024-07-23'),
    };

    const templates: WorkoutTemplate[] = [template1, template2, template3];

    return of(templates);
  }
}
