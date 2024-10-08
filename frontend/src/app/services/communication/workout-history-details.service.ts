import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of, Subject } from 'rxjs';
import { WorkoutHistory } from '../../models/workout-history';

@Injectable({
  providedIn: 'root',
})
export class WorkoutHistoryDetailsService {
  private openModalSource = new Subject<WorkoutHistory>();

  constructor() {}

  modalOpened$ = this.openModalSource.asObservable();

  openModal(workoutHistory: WorkoutHistory) {
    this.openModalSource.next(workoutHistory);
  }
}
