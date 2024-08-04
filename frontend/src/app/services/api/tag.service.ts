import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';
import { Workout } from '../../models/workout';
import { Tag } from '../../models/tag';
import { tags } from './dummy-data/workflow-templates-dummy-daya';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor() {}

  getExistingTags(): Observable<Tag[]> {
    return of([
      { id: 6, name: 'Bulk' },
      { id: 7, name: 'Cut' },
      { id: 8, name: 'Home' },
      { id: 9, name: 'Gym' },
    ]);
  }

  updateTags(tags: Tag[], exerciseId: number): Observable<Tag[]> {
    return of(tags)
  }
}
