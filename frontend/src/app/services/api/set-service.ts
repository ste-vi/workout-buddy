import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sets } from '../../models/set';

@Injectable({
  providedIn: 'root',
})
export class SetService {
  constructor() {}

  // implement when adding BE

  create(set: Sets, exerciseId: number): Observable<Sets> {
    return of(set);
  }

  deleteSet(id: number) {
  }

  updateSetWeight(id: number, weight: number) {}

  updateSetReps(id: number, height: number) {}

  completeSet(id: number) {}
}
