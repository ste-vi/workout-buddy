import { Component } from '@angular/core';
import { BodyWeightTrendWidgetComponent } from '../common/widgets/body-weight-trend-widget/body-weight-trend-widget.component';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import {WorkoutsCalendarComponent} from "../common/widgets/workouts-calendar/workouts-calendar.component";

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    BodyWeightTrendWidgetComponent,
    HeaderButtonComponent,
    WorkoutsCalendarComponent,
  ],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {}
