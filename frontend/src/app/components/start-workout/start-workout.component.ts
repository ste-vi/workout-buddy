import { Component, OnInit } from '@angular/core';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { ButtonComponent } from '../common/button/button.component';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import { MatIcon } from '@angular/material/icon';
import { WorkoutTemplateService } from '../../services/api/workout-template.service';
import { WorkoutTemplate } from '../../models/workout-template';
import { NgForOf, NgIf } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { WorkoutTemplateDetailsService } from '../../services/communication/workout-template-details.service';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { OngoingWorkoutComponent } from '../ongoing-workout/ongoing-workout.component';
import {WorkoutTemplateDetailsComponent} from "../workout-template-details/workout-template-details.component";

@Component({
  selector: 'app-start-workout',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    ButtonComponent,
    MediumButtonComponent,
    MatIcon,
    NgIf,
    TimeAgoPipe,
    NgForOf,
    OngoingWorkoutComponent,
    WorkoutTemplateDetailsComponent,
  ],
  templateUrl: './start-workout.component.html',
  styleUrl: './start-workout.component.scss',
})
export class StartWorkoutComponent implements OnInit {
  protected suggestedWorkoutTemplate: WorkoutTemplate | any = undefined;
  protected workoutTemplates: WorkoutTemplate[] = [];

  constructor(
    private workoutTemplateService: WorkoutTemplateService,
    private workoutTemplateDetailsService: WorkoutTemplateDetailsService,
    private ongoingWorkoutService: OngoingWorkoutService,
  ) {}

  ngOnInit(): void {
    this.workoutTemplateService
      .getSuggestedWorkoutTemplate()
      .subscribe((wt) => (this.suggestedWorkoutTemplate = wt));

    this.workoutTemplateService
      .getWorkoutTemplates()
      .subscribe((array) => (this.workoutTemplates = array));
  }

  openWorkoutTemplateDetails(workoutTemplate: WorkoutTemplate) {
    this.workoutTemplateDetailsService.openModal(workoutTemplate);
  }

  startWorkout(template: WorkoutTemplate) {
    this.ongoingWorkoutService.openModal(template);
  }
}
