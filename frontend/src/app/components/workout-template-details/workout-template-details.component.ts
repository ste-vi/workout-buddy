import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { WorkoutTemplateDetailsService } from '../../services/communication/workout-template-details.service';
import { WorkoutTemplate } from '../../models/workout-template';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '../common/button/button.component';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { OngoingWorkoutComponent } from '../ongoing-workout/ongoing-workout.component';
import {collapse} from "../../animations/collapse";
import {sideModalOpenClose} from "../../animations/side-modal-open-close";
import {fadeInOut} from "../../animations/fade-in-out";

@Component({
  selector: 'app-workout-template-details',
  standalone: true,
  imports: [
    NgIf,
    HeaderButtonComponent,
    MatIcon,
    ButtonComponent,
    NgForOf,
    TimeAgoPipe,
    OngoingWorkoutComponent,
  ],
  templateUrl: './workout-template-details.component.html',
  styleUrl: './workout-template-details.component.scss',
  animations: [sideModalOpenClose, fadeInOut],
})
export class WorkoutTemplateDetailsComponent implements OnInit {
  protected isOpen: boolean = false;
  protected template: WorkoutTemplate | any = undefined;

  constructor(
    private workoutTemplateDetailsService: WorkoutTemplateDetailsService,
    private ongoingWorkoutService: OngoingWorkoutService,
  ) {}

  ngOnInit(): void {
    this.workoutTemplateDetailsService.modalOpened$.subscribe((template) => {
      this.template = template;
      this.isOpen = true;
    });
  }

  closeModal() {
    this.isOpen = false;
  }

  onSwipeRight() {
    this.isOpen = false;
  }

  startWorkout() {
    this.ongoingWorkoutService.openModal(this.template);
    this.closeModal();
  }
}
