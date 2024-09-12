import {Component, Input} from '@angular/core';
import {suggestedWorkoutTemplate} from "../../../../services/api/dummy-data/workflow-templates-dummy-daya";
import {MatIcon} from "@angular/material/icon";
import {MediumButtonComponent} from "../../medium-button/medium-button.component";
import {TimeAgoPipe} from "../../../../pipes/time-ago-pipe";
import {WorkoutHistory} from "../../../../models/workout-history";

@Component({
  selector: 'app-latest-workout-widget',
  standalone: true,
  imports: [MatIcon, MediumButtonComponent, TimeAgoPipe],
  templateUrl: './latest-workout-widget.component.html',
  styleUrl: './latest-workout-widget.component.scss',
})
export class LatestWorkoutWidgetComponent {

  @Input() workoutHistory!: WorkoutHistory;

  constructor() {
  }

  openWorkoutHistoryDetails(workoutHistory: WorkoutHistory) {

  }
}
