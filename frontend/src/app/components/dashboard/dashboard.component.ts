import { Component, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import { WorkoutTemplateDetailsComponent } from '../workout-template-details/workout-template-details.component';
import { LatestWorkoutWidgetComponent } from '../common/widgets/latest-workout-widget/latest-workout-widget.component';
import { WorkoutTemplateWidgetComponent } from '../common/widgets/workout-template-widget/workout-template-widget.component';
import { Router } from '@angular/router';
import { fadeInOut } from '../../animations/fade-in-out';
import { SearchExercisesComponent } from '../common/search-exercises/search-exercises.component';
import { WorkoutTemplateService } from '../../services/api/workout-template.service';
import { WorkoutTemplate } from '../../models/workout-template';
import { NgIf } from '@angular/common';
import { Workout } from '../../models/workout';
import { WorkoutService } from '../../services/api/workout.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIcon,
    MediumButtonComponent,
    WorkoutTemplateDetailsComponent,
    LatestWorkoutWidgetComponent,
    WorkoutTemplateWidgetComponent,
    SearchExercisesComponent,
    NgIf,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [fadeInOut],
})
export class DashboardComponent {
  protected suggestedWorkoutTemplate: WorkoutTemplate | undefined = undefined;
  protected latestWorkoutHistory: Workout | undefined = undefined;

  @ViewChild('exercisesModal')
  exercisesModal!: SearchExercisesComponent;

  constructor(
    private router: Router,
    private workoutTemplateService: WorkoutTemplateService,
    private workoutService: WorkoutService,
  ) {
    workoutTemplateService
      .getSuggestedWorkoutTemplate()
      .subscribe((template) => {
        if (template) {
          this.suggestedWorkoutTemplate = new WorkoutTemplate(template);
        }
      });
    workoutService.getLastPerformedWorkout().subscribe((workout) => {
      this.latestWorkoutHistory = workout ? new Workout(workout) : undefined;
    });
  }

  openWorkoutTemplatesPage() {
    this.router.navigate(['/workout/start']).then((r) => {});
  }

  openWorkoutHistoryPage() {
    this.router.navigate(['/workout/history']).then((r) => {});
  }

  openNotifications() {
    window.location.reload();
  }

  browseExercises() {
    this.exercisesModal.show();
  }
}
