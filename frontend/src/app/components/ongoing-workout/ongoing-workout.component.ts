import { Component, OnInit } from '@angular/core';
import {OngoingWorkoutService} from "../../services/communication/ongoing-workout.service";
import {HeaderButtonComponent} from "../common/header-button/header-button.component";
import {NgForOf, NgIf} from "@angular/common";
import {suggestedWorkoutTemplate, workoutTemplates} from "../../services/api/dummy-data/workflow-templates-dummy-daya";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-ongoing-workout',
  standalone: true,
  imports: [HeaderButtonComponent, NgIf, MatIcon, NgForOf],
  templateUrl: './ongoing-workout.component.html',
  styleUrl: './ongoing-workout.component.scss',
})
export class OngoingWorkoutComponent implements OnInit {
  protected isOpen: boolean = true;
  protected workoutTemplate = workoutTemplates[1];

  constructor(private ongoingWorkoutService: OngoingWorkoutService) {}

  ngOnInit(): void {
    this.ongoingWorkoutService.modalOpened$.subscribe((wt) => {
      this.isOpen = true;
      this.workoutTemplate = wt;
    });
  }

  stopWorkout() {
    this.isOpen = false;
  }
}
