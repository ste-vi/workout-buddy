import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OngoingProcess } from '../../models/ongoing-process';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private apiUrl = `${environment.apiUrl}/processes`;

  constructor(private http: HttpClient) {}

  getOngoingProcess(): Observable<OngoingProcess> {
    return this.http.get<OngoingProcess>(`${this.apiUrl}/ongoing`);
  }
}
