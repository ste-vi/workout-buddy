import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sets } from '../../models/set';
import { PageResponse } from '../../models/page-response';
import {BodyPart, Category, Exercise} from '../../models/exercise';
import {
  exercises,
} from './dummy-data/exercises-dummy-data';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor() {}

  searchExercises(
    page: number,
    size: number,
    query: string,
    bodyPart?: BodyPart,
    category?: Category,
    excludeExercisesIds?: number[],
  ): Observable<PageResponse<Exercise>> {
    const start = page * size;
    const end = start + size;

    let filteredExercises = exercises;

    if (query && query.trim() !== '') {
      filteredExercises = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (bodyPart) {
      filteredExercises = filteredExercises.filter(
        (exercise) => exercise.bodyPart === bodyPart,
      );
    }

    if (category) {
      filteredExercises = filteredExercises.filter(
        (exercise) => exercise.category === category,
      );
    }

    if (excludeExercisesIds && excludeExercisesIds.length > 0) {
      filteredExercises = filteredExercises.filter(
        (exercise) => !excludeExercisesIds.includes(exercise.id),
      );
    }

    const paginatedExercises = filteredExercises.slice(start, end);

    return of({
      content: paginatedExercises,
      pageNumber: page,
      pageSize: size,
      totalPages: Math.ceil(filteredExercises.length / size),
      totalElements: filteredExercises.length,
      last: end >= filteredExercises.length,
    });
  }

  getCategories(): Observable<Category[]> {
    return of(Object.values(Category));
  }

  getBodyParts(): Observable<BodyPart[]> {
    return of(Object.values(BodyPart));
  }

  deleteExercise(id: number): Observable<void> {
    return of(undefined);
  }
}
