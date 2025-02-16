import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../components/auth/auth-service';

export function errorInterceptorFn(authService: AuthService) {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req).pipe(
      catchError((err) => {
        if (err.status === 401 && !req.url.includes('/login')) {
          authService.logout();
        }
        const error = err.error || err.statusText;
        return throwError(() => error);
      }),
    );
  };
}

export const errorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  return errorInterceptorFn(inject(AuthService))(req, next);
};
