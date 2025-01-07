import {Component, ViewChild} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import { suggestedWorkoutTemplate } from '../../services/api/dummy-data/workflow-templates-dummy-daya';
import { workout } from '../../services/api/dummy-data/workout-histories-dummy-data';
import { OngoingWorkoutComponent } from '../ongoing-workout/ongoing-workout.component';
import { WorkoutTemplateDetailsComponent } from '../workout-template-details/workout-template-details.component';
import { LatestWorkoutWidgetComponent } from '../common/widgets/latest-workout-widget/latest-workout-widget.component';
import { WorkoutTemplateWidgetComponent } from '../common/widgets/workout-template-widget/workout-template-widget.component';
import { Router } from '@angular/router';
import { fadeInOut } from '../../animations/fade-in-out';
import {ExerciseService} from "../../services/api/exercise-service";
import {SearchExercisesComponent} from "../common/search-exercises/search-exercises.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIcon,
    MediumButtonComponent,
    OngoingWorkoutComponent,
    WorkoutTemplateDetailsComponent,
    LatestWorkoutWidgetComponent,
    WorkoutTemplateWidgetComponent,
    SearchExercisesComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [fadeInOut],
})
export class DashboardComponent {
  protected readonly suggestedWorkoutTemplate = suggestedWorkoutTemplate;
  protected readonly latestWorkoutHistory = workout[0];

  @ViewChild('exercisesModal')
  exercisesModal!: SearchExercisesComponent;

  constructor(private router: Router) {}

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
