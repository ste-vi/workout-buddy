import { Component } from '@angular/core';
import {HeaderButtonComponent} from "../common/header-button/header-button.component";
import {ButtonComponent} from "../common/button/button.component";
import {MediumButtonComponent} from "../common/medium-button/medium-button.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-start-workout',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    ButtonComponent,
    MediumButtonComponent,
    MatIcon,
  ],
  templateUrl: './start-workout.component.html',
  styleUrl: './start-workout.component.scss',
})
export class StartWorkoutComponent {}
