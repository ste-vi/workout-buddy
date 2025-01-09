import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';
import { Workout } from '../../models/workout';
import { PageResponse } from '../../models/page-response';
import { workout } from './dummy-data/workout-histories-dummy-data';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor() {}

  startWorkout(template: WorkoutTemplate): Observable<Workout> {
    const newWorkout = new Workout(
      Math.floor(Math.random() * 100000),
      template.title,
      new Date(), // startTime
      new Date(), // endTime (you might want to set this later)
      0, // totalSets
      0, // prReps
      0, // totalWeight
      template.exercises.length,
      template.tags,
      template.exercises,
    );

    return of(newWorkout);
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
