import { Component, OnInit } from '@angular/core';
import {
  AreaChartModule,
  Color,
  DataItem,
  ScaleType,
} from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { BodyWeightService } from '../../../../services/api/body-weight.service';

interface ChartDataSet {
  name: string;
  series: DataItem[];
}

@Component({
  selector: 'app-weight-trend-widget',
  standalone: true,
  imports: [AreaChartModule],
  templateUrl: './body-weight-trend-widget.component.html',
  styleUrl: './body-weight-trend-widget.component.scss',
})
export class BodyWeightTrendWidgetComponent implements OnInit {
  readonly curve = shape.curveMonotoneX;
  dataset: ChartDataSet[] = [];
  series: DataItem[] = [];
  minYValue = 40;

  constructor(private bodyWeightService: BodyWeightService) {}

  ngOnInit(): void {
    this.bodyWeightService
      .getLast5BodyWeightMeasures()
      .subscribe((measures) => {
        if (measures.length === 0) {
          this.dataset = [];
          this.minYValue = 0;
          return;
        }
        this.updateChartData(measures);
      });
  }

  private updateChartData(measures: { date: Date; value: number }[]): void {
    this.series = measures.map((measure) => ({
      name: measure.date.toISOString(),
      value: measure.value,
    }));

    this.minYValue =
      this.series.reduce(
        (min, item) => (item.value < min ? item.value : min),
        Number.MAX_VALUE,
      ) - 1;

    this.dataset = [
      {
        name: 'Body Weight',
        series: this.series,
      },
    ];
  }

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#92A3FD'],
  };

  xAxisTickFormatting = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  yAxisTickFormatting = (value: number): string => {
    return `${value} kg`;
  };
}
