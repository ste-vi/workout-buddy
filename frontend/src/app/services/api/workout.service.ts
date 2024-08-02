import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';
import { Workout } from '../../models/workout';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor() {}

  startWorkout(template: WorkoutTemplate): Observable<Workout> {
    // Simulate workout start by creating a new workout instance based on the provided template
    const newWorkout: Workout = {
      id: Math.floor(Math.random() * 100000),
      title: template.title,
      date: new Date(),
      duration: '0 min',
      exercises: template.exercises,
      tags: template.tags,
      workoutTemplate: template,
    };
    return of(newWorkout);
  }
}
