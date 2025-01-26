import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor() {
    const token = localStorage.getItem('auth_token');
    this._isAuthenticated.next(!!token);
  }

  login(username: string, password: string): Observable<boolean> {
    this._isAuthenticated.next(true);
    return of(true);
  }

  logout() {
    this._isAuthenticated.next(false);
  }

  register(username: string, email: string, password: string): Observable<boolean> {
    this._isAuthenticated.next(true);
    return of(true)
  }
}
