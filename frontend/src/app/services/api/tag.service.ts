import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of } from 'rxjs';
import { Workout } from '../../models/workout';
import { Tag } from '../../models/tag';
import { tags } from './dummy-data/workflow-templates-dummy-daya';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/tags`;

  constructor(private http: HttpClient) {}

  getExistingTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}`);
  }

  updateTags(tags: Tag[], exerciseId: number): Observable<Tag[]> {
    return of(tags);
  }
}
