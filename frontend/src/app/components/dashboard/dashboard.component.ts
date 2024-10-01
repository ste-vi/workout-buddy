import { Component } from '@angular/core';
import { NavbarComponent } from '../common/navbar/navbar.component';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { MatIcon } from '@angular/material/icon';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import { NgIf } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { suggestedWorkoutTemplate } from '../../services/api/dummy-data/workflow-templates-dummy-daya';
import { workoutHistory } from '../../services/api/dummy-data/workout-histories-dummy-data';
import { MatTooltip } from '@angular/material/tooltip';
import { OngoingWorkoutComponent } from '../ongoing-workout/ongoing-workout.component';
import { WorkoutTemplateDetailsComponent } from '../workout-template-details/workout-template-details.component';
import { LatestWorkoutWidgetComponent } from '../common/widgets/latest-workout-widget/latest-workout-widget.component';
import { WorkoutTemplateWidgetComponent } from '../common/widgets/workout-template-widget/workout-template-widget.component';
import { Router } from '@angular/router';
import {fadeInOut} from "../../animations/fade-in-out";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    HeaderButtonComponent,
    MatIcon,
    MediumButtonComponent,
    NgIf,
    TimeAgoPipe,
    MatTooltip,
    OngoingWorkoutComponent,
    WorkoutTemplateDetailsComponent,
    LatestWorkoutWidgetComponent,
    WorkoutTemplateWidgetComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [fadeInOut]
})
export class DashboardComponent {
  protected readonly suggestedWorkoutTemplate = suggestedWorkoutTemplate;
  protected readonly latestWorkoutHistory = workoutHistory[0];

  constructor(private router: Router) {}

  openWorkoutTemplatesPage() {
    this.router.navigate(['/workout/start']).then((r) => {});
  }

  openWorkoutHistoryPage() {
    this.router.navigate(['/workout/history']).then((r) => {});
  }
}
