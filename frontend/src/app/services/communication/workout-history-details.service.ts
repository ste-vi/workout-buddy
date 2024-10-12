import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Workout } from '../../models/workout';

@Injectable({
  providedIn: 'root',
})
export class WorkoutHistoryDetailsService {
  private openModalSource = new Subject<Workout>();

  constructor() {}

  modalOpened$ = this.openModalSource.asObservable();

  openModal(workout: Workout) {
    this.openModalSource.next(workout);
  }
}
