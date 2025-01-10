import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MediumButtonComponent } from '../../medium-button/medium-button.component';
import { TimeAgoPipe } from '../../../../pipes/time-ago-pipe';
import { WorkoutTemplate } from '../../../../models/workout-template';
import { WorkoutTemplateDetailsService } from '../../../../services/communication/workout-template-details.service';
import { OngoingWorkoutService } from '../../../../services/communication/ongoing-workout.service';
import { fadeInOut } from '../../../../animations/fade-in-out';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-workout-template-widget',
  standalone: true,
  imports: [MatIcon, MediumButtonComponent, TimeAgoPipe, NgIf],
  templateUrl: './workout-template-widget.component.html',
  styleUrl: './workout-template-widget.component.scss',
  animations: [fadeInOut],
})
export class WorkoutTemplateWidgetComponent {
  @Input() workoutTemplate!: WorkoutTemplate;

  constructor(
    private workoutTemplateDetailsService: WorkoutTemplateDetailsService,
    private ongoingWorkoutService: OngoingWorkoutService,
  ) {}

  openWorkoutDetails(workoutTemplate: WorkoutTemplate) {
    this.workoutTemplateDetailsService.openModal(workoutTemplate);
  }

  startWorkout(workoutTemplate: WorkoutTemplate) {
    this.ongoingWorkoutService.openModal(workoutTemplate);
  }
}
