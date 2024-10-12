import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import {
  DatePipe,
  KeyValue,
  KeyValuePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LatestWorkoutWidgetComponent } from '../common/widgets/latest-workout-widget/latest-workout-widget.component';
import { SelectionMenuComponent } from '../common/selection-menu/selection-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { collapse } from '../../animations/collapse';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { fadeInOut } from '../../animations/fade-in-out';
import { staggerFadeIn } from '../../animations/stagger-fade-in';
import { WorkoutService } from '../../services/api/workout.service';
import {Workout} from "../../models/workout";

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    NgIf,
    DatePipe,
    NgForOf,
    MatIcon,
    LatestWorkoutWidgetComponent,
    SelectionMenuComponent,
    ReactiveFormsModule,
    FormsModule,
    KeyValuePipe,
    InfiniteScrollDirective,
    NgClass,
  ],
  templateUrl: './workout-history.component.html',
  styleUrl: './workout-history.component.scss',
  animations: [collapse, fadeInOut, staggerFadeIn],
})
export class WorkoutHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('dateCarousel') private dateCarousel!: ElementRef<HTMLElement>;

  protected isListView = false;

  protected dates: Date[] = [];
  protected currentIndex = 0;
  protected currentMonth: Date;

  protected workout: Workout[] = [];
  protected groupedWorkoutHistory: Map<string, Workout[]> = new Map();
  protected currentDayWorkoutHistory: Workout[] = [];

  protected currentPage: number = 0;
  protected itemsPerPage: number = 30;
  protected hasMoreItems: boolean = true;
  protected searchQuery: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private workoutService: WorkoutService,
  ) {
    this.currentMonth = new Date();
  }

  ngOnInit(): void {
    if (this.isListView) {
      this.searchWorkoutHistory();
    } else {
      this.fetchWorkoutHistory();
    }

    this.generateDates();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCarouselView();
      this.cdr.detectChanges();
    });
  }

  private searchWorkoutHistory(isSearch: boolean = false): void {
    if (isSearch) {
      this.workout = [];
      this.currentPage = 0;
    }

    this.workoutService
      .searchWorkoutHistory(
        this.currentPage,
        this.itemsPerPage,
        undefined,
        undefined,
        this.searchQuery,
      )
      .subscribe((pageResponse) => {
        this.workout = isSearch
          ? pageResponse.content
          : this.workout.concat(pageResponse.content);

        this.hasMoreItems = !pageResponse.last;
      });

    this.groupWorkoutHistory();
  }

  private fetchWorkoutHistory() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.workoutService
      .searchWorkoutHistory(0, 100, firstDay, lastDay, undefined)
      .subscribe((pageResponse) => {
        this.workout = pageResponse.content;
      });
  }

  private groupWorkoutHistory() {
    this.groupedWorkoutHistory = new Map();

    this.workout.forEach((history) => {
      const date = new Date(history.date);
      const monthYear = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!this.groupedWorkoutHistory.has(monthYear)) {
        this.groupedWorkoutHistory.set(monthYear, []);
      }

      this.groupedWorkoutHistory.get(monthYear)?.push(history);
    });

    this.groupedWorkoutHistory.forEach((histories) => {
      histories.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });

    const sortedEntries = [...this.groupedWorkoutHistory.entries()].sort(
      (a, b) => {
        const [monthYearA] = a[0].split(' ');
        const [monthYearB] = b[0].split(' ');
        const dateA = new Date(
          Date.parse(`${monthYearA} 1, ${a[0].split(' ')[1]}`),
        );
        const dateB = new Date(
          Date.parse(`${monthYearB} 1, ${b[0].split(' ')[1]}`),
        );

        return dateB.getTime() - dateA.getTime();
      },
    );

    this.groupedWorkoutHistory = new Map(sortedEntries);
  }

  private initCarouselView() {
    this.scrollToCurrentDate();
    this.initCurrentDayWorkoutHistory();
    this.addWheelEventListener();
  }

  private initCurrentDayWorkoutHistory() {
    let date = this.dates[this.currentIndex].getDate();

    this.currentDayWorkoutHistory = this.workout.filter(
      (history) =>
        history.date.getFullYear() === this.currentMonth.getFullYear() &&
        history.date.getMonth() === this.currentMonth.getMonth() &&
        history.date.getDate() === date,
    );
  }

  private generateDates(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    this.dates = Array.from(
      { length: lastDay },
      (_, i) => new Date(year, month, i + 1),
    );
  }

  private scrollToCurrentDate(): void {
    const today = new Date();
    const todayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const index = this.dates.findIndex(
      (date) => date.getTime() === todayLocal.getTime(),
    );

    this.selectDate(index !== -1 ? index : 0);
  }

  private scrollCarousel(): void {
    if (this.dateCarousel) {
      const container = this.dateCarousel.nativeElement;
      const index = Math.max(0, this.currentIndex - 1);
      const item = container.children[index] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const itemWidth = item.offsetWidth;

      const scrollLeft = item.offsetLeft - containerWidth / 2 + itemWidth / 2;

      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }

  protected onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollPosition = target.scrollLeft;
    const itemWidth = (target.children[0] as HTMLElement).clientWidth;
    this.currentIndex = Math.round(scrollPosition / itemWidth);

    this.initCurrentDayWorkoutHistory();
  }

  protected selectDate(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.dates.length - 1));
    this.scrollCarousel();
    this.initCurrentDayWorkoutHistory();
  }

  protected changeMonth(delta: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + delta,
      1,
    );
    this.generateDates();
    this.selectDate(this.currentIndex);
    this.scrollCarousel();
    this.fetchWorkoutHistory();
  }

  protected prevMonth(): void {
    this.changeMonth(-1);
  }

  protected nextMonth(): void {
    this.changeMonth(1);
  }

  private addWheelEventListener(): void {
    this.dateCarousel.nativeElement.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        const scrollAmount = event.deltaY > 0 ? 50 : -50;
        this.dateCarousel.nativeElement.scrollLeft += scrollAmount;
      },
      { passive: true },
    );
  }

  switchView() {
    this.isListView = !this.isListView;
    this.workout = [];
    if (this.isListView) {
      this.searchWorkoutHistory();
    } else {
      setTimeout(() => {
        this.fetchWorkoutHistory();
        this.initCarouselView();
      });
    }
  }

  search() {
    this.searchWorkoutHistory(true);
  }

  loadMore() {
    if (this.hasMoreItems) {
      this.currentPage++;
      this.searchWorkoutHistory();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.searchWorkoutHistory();
  }

  originalOrder = (
    a: KeyValue<string, Workout[]>,
    b: KeyValue<string, Workout[]>,
  ): number => {
    return 0;
  };
}
