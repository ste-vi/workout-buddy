import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Authentication } from '../../models/authentication';
import {HttpClient, HttpResponse} from '@angular/common/http';
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

  loginViaGoogle(): void {
    window.open(this.apiUrl + '/google/login', '_self');
  }

  loginWithCredentials(
    username: string,
    password: string,
  ): Observable<HttpResponse<Authentication>> {
    const request = { username, password };
    return this.http.post<Authentication>(`${this.apiUrl}/login`, request, {
      headers: { skip: 'true' },
      observe: 'response'
    }).pipe(
      tap((response) => {
        if (response.body && response.body.token) {
          this.authorize(response.body.token);
        }
      })
    );
  }

  logout() {
    this._isAuthenticated.next(false);
    this.removeAuthorization();
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
            this.authorize(response.token);
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

  authorize(accessToken: string): void {
    this.setAccessToken(accessToken);
    this._isAuthenticated.next(true);
  }

  removeAuthorization(): void {
    localStorage.removeItem('accessToken');
  }
}
