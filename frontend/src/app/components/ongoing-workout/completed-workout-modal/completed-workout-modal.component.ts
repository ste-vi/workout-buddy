import { Component } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Workout } from '../../../models/workout';
import { CompletedWorkoutModalService } from '../../../services/communication/completed-workout-modal.service';
import { MediumButtonComponent } from '../../common/medium-button/medium-button.component';
import { dialogOpenClose } from '../../../animations/dialog-open-close';
import { fadeInOut } from '../../../animations/fade-in-out';
import { WorkoutTemplateService } from '../../../services/api/workout-template.service';
import { WorkoutTemplate } from '../../../models/workout-template';

@Component({
  selector: 'app-completed-workout-modal',
  standalone: true,
  imports: [NgIf, DatePipe, MediumButtonComponent],
  templateUrl: './completed-workout-modal.component.html',
  styleUrl: './completed-workout-modal.component.scss',
  animations: [dialogOpenClose, fadeInOut],
})
export class CompletedWorkoutModalComponent {
  isOpen: boolean = false;

  isTemplateChanged: boolean = false;
  workout: Workout | undefined;
  workoutNumber: number = 1;
  templateId: number | undefined = undefined;

  constructor(
    private completedWorkoutModalService: CompletedWorkoutModalService,
    private workoutTemplateService: WorkoutTemplateService,
  ) {
    this.completedWorkoutModalService.modalOpened$.subscribe((data) => {
      this.workout = data.workout;
      this.isTemplateChanged = data.completionResponse.updateTemplate;
      this.workoutNumber = data.completionResponse.workoutsCount;
      this.templateId = data.completionResponse.templateId;
      this.show();
    });
  }

  show() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  updateTemplate() {
    this.workoutTemplateService
      .updateWorkoutTemplateFromWorkout(
        new WorkoutTemplate({
          id: this.templateId,
          exercises: this.workout!.exercises,
        }),
      )
      .subscribe(() => {
        this.close();
      });
  }
}
