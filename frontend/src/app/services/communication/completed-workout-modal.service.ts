import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Workout } from "../../models/workout";
import { WorkoutCompletionResponse } from "../../models/workout-completion-response";

@Injectable({
  providedIn: 'root',
})
export class CompletedWorkoutModalService {
  private openModalSource = new Subject<{ workout: Workout, completionResponse: WorkoutCompletionResponse }>();

  constructor() {}

  modalOpened$ = this.openModalSource.asObservable();

  openModal(workout: Workout, completionResponse: WorkoutCompletionResponse) {
    this.openModalSource.next({ workout, completionResponse });
  }
}
