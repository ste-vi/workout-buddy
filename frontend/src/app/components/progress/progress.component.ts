import { Component } from '@angular/core';
import { BodyWeightTrendWidgetComponent } from '../common/widgets/body-weight-trend-widget/body-weight-trend-widget.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [BodyWeightTrendWidgetComponent],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {}
