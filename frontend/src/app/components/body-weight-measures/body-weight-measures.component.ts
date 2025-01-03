import { Component, OnInit } from '@angular/core';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { BodyWeightMeasuresService } from '../../services/communication/body-weight-measures.service';
import { sideModalOpenClose } from '../../animations/side-modal-open-close';
import { fadeInOut } from '../../animations/fade-in-out';
import { BodyWeightMeasure } from '../../models/body-weight-measure';
import { BodyWeightService } from '../../services/api/body-weight.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { collapseEnter } from '../../animations/collapse-enter';
import { SortOrder } from '../../models/sort-order';
import { MatIcon } from '@angular/material/icon';
import {
  AreaChartModule,
  Color,
  DataItem,
  ScaleType,
} from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { ChartDataSet } from '../common/widgets/body-weight-trend-widget/body-weight-trend-widget.component';

@Component({
  selector: 'app-body-weight-measures',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    NgIf,
    InfiniteScrollDirective,
    NgForOf,
    DatePipe,
    MatIcon,
    AreaChartModule,
  ],
  templateUrl: './body-weight-measures.component.html',
  styleUrl: './body-weight-measures.component.scss',
  animations: [fadeInOut, sideModalOpenClose, collapseEnter],
})
export class BodyWeightMeasuresComponent implements OnInit {
  protected isOpen: boolean = true;

  protected measures: BodyWeightMeasure[] = [];

  protected currentPage: number = 0;
  protected itemsPerPage: number = 30;
  protected dateFrom: Date = new Date();
  protected dateTo: Date = new Date();
  protected hasMoreItems: boolean = true;
  protected sortOrder: SortOrder = SortOrder.DESC;

  protected readonly SortOrder = SortOrder;

  readonly curve = shape.curveBasis;
  dataset: ChartDataSet[] = [];
  series: DataItem[] = [];
  minYValue = 40;

  constructor(
    private bodyWeightMeasuresService: BodyWeightMeasuresService,
    private bodyWeightService: BodyWeightService,
  ) {
    this.dateFrom = new Date(
      this.dateTo.getFullYear(),
      this.dateTo.getMonth() - 12,
      this.dateTo.getDate(),
    );
    this.loadMeasures();
  }

  ngOnInit(): void {
    this.bodyWeightMeasuresService.modalOpened$.subscribe(() => {
      this.currentPage = 0;
      this.measures = [];

      this.loadMeasures();

      this.isOpen = true;
    });
  }

  onSwipeRight() {
    this.closeModal();
  }

  closeModal() {
    this.isOpen = false;
  }

  private loadMeasures() {
    this.bodyWeightService
      .searchBodyWeightMeasures(
        this.currentPage,
        this.itemsPerPage,
        this.dateFrom,
        this.dateTo,
        this.sortOrder,
      )
      .subscribe((pageResponse) => {
        this.measures = this.measures.concat(pageResponse.content);
        this.hasMoreItems = !pageResponse.last;
        this.updateChartData(this.measures);
      });
  }

  loadMore() {
    if (this.hasMoreItems) {
      this.currentPage++;
      this.loadMeasures();
    }
  }

  compareValues(currentValue: number, previousValue: number): string {
    if (currentValue > previousValue) {
      return 'greater';
    } else if (currentValue < previousValue) {
      return 'less';
    } else {
      return 'equal';
    }
  }

  addWeightMeasure() {}

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Time,
    domain: ['white'],
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

  private updateChartData(measures: BodyWeightMeasure[]): void {
    this.series = measures.map((measure) => {
      return {
        name: measure.date,
        value: measure.value,
      };
    });

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
}
