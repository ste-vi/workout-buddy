import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BodyWeightService } from '../api/body-weight.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(private bodyWeightService: BodyWeightService) {}

  sync(): Observable<boolean> {
    return from(this.checkOnline()).pipe(
      switchMap((online) => {
        if (online) {
          return this.bodyWeightService.syncWithBackend().pipe(
            map(() => true),
            catchError((error) => {
              console.error('Sync error:', error);
              alert('Sync error:' + error)
              return of(false);
            }),
          );
        } else {
          console.log('Device is offline, skipping sync');
          return of(true);
        }
      }),
      catchError((error) => {
        console.error('Sync error:', error);
        alert('Sync error:' + error)
        return of(false);
      }),
    );
  }

  private checkOnline(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof navigator.onLine !== 'undefined') {
        resolve(navigator.onLine);
      } else {
        // If navigator.onLine is not supported, assume online
        resolve(true);
      }
    });
  }
}
