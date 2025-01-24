import { Component } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { WorkoutHistoryPreview } from '../../../../../models/workout-history-preview';
import { dialogOpenClose } from '../../../../../animations/dialog-open-close';
import { fadeInOut } from '../../../../../animations/fade-in-out';
import { MatIcon } from '@angular/material/icon';
import { MediumButtonComponent } from '../../../medium-button/medium-button.component';
import { WorkoutHistoryDetailsService } from '../../../../../services/communication/workout-history-details.service';
import { WorkoutService } from '../../../../../services/api/workout.service';

@Component({
  selector: 'app-workout-history-preview-modal',
  standalone: true,
  imports: [NgIf, DatePipe, MatIcon, MediumButtonComponent, NgForOf],
  templateUrl: './workout-history-preview-modal.component.html',
  styleUrl: './workout-history-preview-modal.component.scss',
  animations: [dialogOpenClose, fadeInOut],
})
export class WorkoutHistoryPreviewModalComponent {
  protected isOpen: boolean = false;
  protected day: Date = new Date();
  protected workoutHistoryPreviews: WorkoutHistoryPreview[] = [];

  constructor(
    private workoutHistoryDetailsService: WorkoutHistoryDetailsService,
    private workoutService: WorkoutService,
  ) {}

  show(day: Date, workoutHistoryPreviews: WorkoutHistoryPreview[]) {
    this.day = day;
    this.workoutHistoryPreviews = workoutHistoryPreviews;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  openWorkoutHistoryDetails(preview: WorkoutHistoryPreview) {
    this.workoutService.getWorkoutById(preview.id).subscribe((workout) => {
      this.workoutHistoryDetailsService.openModal(workout);
      this.close();
    });
  }
}
