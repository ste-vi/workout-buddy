import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Authentication } from '../../models/authentication';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    this._isAuthenticated.next(!!token);
  }

  login(username: string, password: string): Observable<boolean> {
    this._isAuthenticated.next(true);
    return of(true);
  }

  logout() {
    this._isAuthenticated.next(false);
  }

  register(
    username: string,
    email: string,
    password: string,
  ): Observable<Authentication> {
    return this.http
      .post<Authentication>(`${this.apiUrl}/register`, {
        username,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            this.setAccessToken(response.token);
            this._isAuthenticated.next(true);
          }
        }),
      );
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
