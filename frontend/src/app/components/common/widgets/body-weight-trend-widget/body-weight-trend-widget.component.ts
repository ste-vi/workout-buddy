import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AreaChartModule,
  Color,
  DataItem,
  ScaleType,
} from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { BodyWeightService } from '../../../../services/api/body-weight.service';
import { BodyWeightMeasuresService } from '../../../../services/communication/body-weight-measures.service';
import {BodyWeightMeasuresComponent} from "../../../body-weight-measures/body-weight-measures.component";
import {NgIf} from "@angular/common";
import {BodyWeightMeasure} from "../../../../models/body-weight-measure";
import {UpdateWeightModalComponent} from "../../modal/update-weight-modal/update-weight-modal.component";
import {TagsModalComponent} from "../../modal/tags-modal/tags-modal.component";

export interface ChartDataSet {
  name: string;
  series: DataItem[];
}

@Component({
  selector: 'app-weight-trend-widget',
  standalone: true,
  imports: [
    AreaChartModule,
    BodyWeightMeasuresComponent,
    NgIf,
    UpdateWeightModalComponent,
  ],
  templateUrl: './body-weight-trend-widget.component.html',
  styleUrl: './body-weight-trend-widget.component.scss',
})
export class BodyWeightTrendWidgetComponent implements OnInit {
  protected readonly curve = shape.curveBasis;
  protected dataset: ChartDataSet[] = [];
  protected series: DataItem[] = [];
  protected minYValue = 40;
  protected currentWeightMeasure: BodyWeightMeasure | undefined;

  @ViewChild('updateWeightModal')
  updateWeightModal!: UpdateWeightModalComponent;

  constructor(
    private bodyWeightService: BodyWeightService,
    private bodyWeightMeasuresService: BodyWeightMeasuresService,
  ) {}

  ngOnInit(): void {
    this.loadLast5Measures();
    this.bodyWeightService.dataChanged$.subscribe(() => {
      this.loadLast5Measures();
    });
  }

  private loadLast5Measures() {
    this.bodyWeightService
      .getLast5BodyWeightMeasures()
      .subscribe((measures) => {
        if (measures.length === 0) {
          this.dataset = [];
          this.minYValue = 0;
          return;
        }
        this.currentWeightMeasure = measures[0];
        this.updateChartData(measures);
      });
  }

  private updateChartData(measures: BodyWeightMeasure[]): void {
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
    group: ScaleType.Time,
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

  openBodyWeightMeasuresPage() {
    this.bodyWeightMeasuresService.openModal();
  }

  track() {
    this.updateWeightModal.show(undefined, this.currentWeightMeasure?.value);
  }
}
