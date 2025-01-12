import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../../models/tag';
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
}
