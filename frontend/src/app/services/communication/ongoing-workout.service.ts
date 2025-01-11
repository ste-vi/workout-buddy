import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Workout } from '../../models/workout';

@Injectable({
  providedIn: 'root',
})
export class OngoingWorkoutService {
  private openModalSource = new Subject<Workout>();
  private isModalOpenSource = new BehaviorSubject<boolean>(false);

  constructor() {}

  modalOpened$ = this.openModalSource.asObservable();

  openModal(workout: Workout) {
    this.openModalSource.next(workout);
  }

  closeModal() {
    this.isModalOpenSource.next(false);
  }
}
