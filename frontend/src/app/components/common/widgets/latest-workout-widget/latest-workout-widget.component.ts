import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MediumButtonComponent } from '../../medium-button/medium-button.component';
import { TimeAgoPipe } from '../../../../pipes/time-ago-pipe';
import { fadeInOut } from '../../../../animations/fade-in-out';
import { NgIf } from '@angular/common';
import { WorkoutHistoryDetailsComponent } from '../../../workout-history-details/workout-history-details.component';
import { WorkoutHistoryDetailsService } from '../../../../services/communication/workout-history-details.service';
import {getWorkoutDuration, Workout} from "../../../../models/workout";

@Component({
  selector: 'app-latest-workout-widget',
  standalone: true,
  imports: [
    MatIcon,
    MediumButtonComponent,
    TimeAgoPipe,
    NgIf,
    WorkoutHistoryDetailsComponent,
  ],
  templateUrl: './latest-workout-widget.component.html',
  styleUrl: './latest-workout-widget.component.scss',
  animations: [fadeInOut],
})
export class LatestWorkoutWidgetComponent {
  @Input() workout!: Workout;
  @Input() disableAnimation: boolean = false;

  constructor(
    private workoutHistoryDetailsService: WorkoutHistoryDetailsService,
  ) {}

  openWorkoutHistoryDetails(workout: Workout) {
    this.workoutHistoryDetailsService.openModal(workout);
  }

  protected readonly getWorkoutDuration = getWorkoutDuration;
}
