import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import { UpdateWeightModalComponent } from '../common/modal/update-weight-modal/update-weight-modal.component';
import { ConfirmationModalComponent } from '../common/modal/confirmation-modal/confirmation-modal.component';
import {interval, startWith, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";

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
    UpdateWeightModalComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './body-weight-measures.component.html',
  styleUrl: './body-weight-measures.component.scss',
  animations: [fadeInOut, sideModalOpenClose, collapseEnter],
})
export class BodyWeightMeasuresComponent implements OnInit {
  protected isOpen: boolean = false;

  protected measures: BodyWeightMeasure[] = [];
  protected measureToDelete: BodyWeightMeasure | undefined;

  protected currentPage: number = 0;
  protected itemsPerPage: number = 30;
  protected hasMoreItems: boolean = true;
  protected sortOrder: SortOrder = SortOrder.DESC;

  protected readonly SortOrder = SortOrder;

  readonly curve = shape.curveBasis;
  dataset: ChartDataSet[] = [];
  series: DataItem[] = [];
  minYValue = 40;

  @ViewChild('updateWeightModal')
  updateWeightModal!: UpdateWeightModalComponent;

  @ViewChild('deleteWeightConfirmationModal')
  deleteWeightConfirmationModal!: ConfirmationModalComponent;

  constructor(
    private bodyWeightMeasuresService: BodyWeightMeasuresService,
    private bodyWeightService: BodyWeightService,
  ) {
    this.bodyWeightService.dataChanged$.subscribe(() => {
      this.loadMeasures();
    });
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

  private loadMeasures(search?: boolean) {
    this.bodyWeightService
      .searchBodyWeightMeasures(
        this.currentPage,
        this.itemsPerPage,
        this.sortOrder
      )
      .subscribe((pageResponse) => {
        if (search) {
          this.measures = this.measures.concat(pageResponse.content);
        } else {
          this.measures = pageResponse.content;
        }
        this.hasMoreItems = !pageResponse.last;
        this.updateChartData(this.measures);
      });
  }

  loadMore() {
    if (this.hasMoreItems) {
      this.currentPage++;
      this.loadMeasures(true);
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

  addWeightMeasure() {
    this.updateWeightModal.show(undefined, this.measures[0]?.value);
  }

  edit(measure: BodyWeightMeasure) {
    this.updateWeightModal.show(measure);
  }

  onDeleteWeightConfirmed(confirmed: boolean) {
    if (confirmed) {
      this.bodyWeightService
        .deleteBodyWeightMeasure(this.measureToDelete!.id!)
        .subscribe(() => {
          this.measures = this.measures.filter(
            (m) => m.id !== this.measureToDelete!.id,
          );
          this.updateChartData(this.measures);
        });
    }
  }

  delete(measure: BodyWeightMeasure) {
    this.measureToDelete = measure;
    this.deleteWeightConfirmationModal.show('This action cannot be undone');
  }
}
