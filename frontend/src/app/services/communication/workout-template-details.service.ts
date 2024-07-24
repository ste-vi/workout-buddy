import { Injectable } from '@angular/core';
import { WorkoutTemplate } from '../../models/workout-template';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutTemplateDetailsService {

  private openModalSource = new Subject<WorkoutTemplate>();

  constructor() {}

  modalOpened$ = this.openModalSource.asObservable();

  openModal(workoutTemplate: WorkoutTemplate){
    this.openModalSource.next(workoutTemplate);
  }
}
