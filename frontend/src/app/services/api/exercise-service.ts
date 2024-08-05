import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sets } from '../../models/set';
import { PageResponse } from '../../models/page-response';
import { Exercise } from '../../models/exercise';
import {BodyPart, Category, exercises} from './dummy-data/exercises-dummy-data';

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
    const filteredExercises = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query.toLowerCase()),
    );
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
}
