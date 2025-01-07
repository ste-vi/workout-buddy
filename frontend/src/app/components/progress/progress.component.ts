import { Component } from '@angular/core';
import { BodyWeightTrendWidgetComponent } from '../common/widgets/body-weight-trend-widget/body-weight-trend-widget.component';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { BmiWidgetComponent } from '../common/widgets/bmi-widget/bmi-widget.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    BodyWeightTrendWidgetComponent,
    HeaderButtonComponent,
    BmiWidgetComponent,
    BmiWidgetComponent,
  ],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {}
