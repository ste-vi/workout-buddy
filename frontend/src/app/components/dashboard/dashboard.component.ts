import { Component } from '@angular/core';
import {NavbarComponent} from "../common/navbar/navbar.component";
import {HeaderButtonComponent} from "../common/header-button/header-button.component";
import {MatIcon} from "@angular/material/icon";
import {MediumButtonComponent} from "../common/medium-button/medium-button.component";
import {NgIf} from "@angular/common";
import {TimeAgoPipe} from "../../pipes/time-ago-pipe";
import {suggestedWorkoutTemplate} from "../../services/api/dummy-data/workflow-templates-dummy-daya";
import {WorkoutTemplate} from "../../models/workout-template";
import {workoutHistory} from "../../services/api/dummy-data/workout-histories-dummy-data";
import {WorkoutHistory} from "../../models/workout-history";

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly suggestedWorkoutTemplate = suggestedWorkoutTemplate;
  protected readonly latestWorkoutHistory = workoutHistory[0];

  openWorkoutDetails(suggestedWorkoutTemplate: WorkoutTemplate) {


  }

  protected readonly workoutHistory = workoutHistory;

  openWorkoutHistoryDetails(workoutHistory: WorkoutHistory) {

  }
}
