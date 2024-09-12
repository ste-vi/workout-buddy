import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { WorkoutHistoryService } from '../../services/api/workout-history.service';
import { LatestWorkoutWidgetComponent } from '../common/widgets/latest-workout-widget/latest-workout-widget.component';
import { WorkoutHistory } from '../../models/workout-history';

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
  ],
  templateUrl: './workout-history.component.html',
  styleUrl: './workout-history.component.scss',
})
export class WorkoutHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('dateCarousel') private dateCarousel!: ElementRef<HTMLElement>;

  protected isListView = false;
  protected dates: Date[] = [];
  protected currentIndex = 0;
  protected currentMonth: Date;
  protected workoutHistory: WorkoutHistory[] = [];
  protected currentDayWorkoutHistory: WorkoutHistory[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private workoutHistoryService: WorkoutHistoryService,
  ) {
    this.currentMonth = new Date();
  }

  ngOnInit(): void {
    this.fetchWorkoutHistory();
    this.generateDates();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCarouselView();
      this.cdr.detectChanges();
    });
  }

  private fetchWorkoutHistory() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.workoutHistoryService
      .getWorkoutHistory(firstDay, lastDay)
      .subscribe((histories) => {
        this.workoutHistory = histories;
      });
  }

  private initCarouselView() {
    this.scrollToCurrentDate();
    this.initCurrentDayWorkoutHistory();
    this.addWheelEventListener();
  }

  private initCurrentDayWorkoutHistory() {
    let date = this.dates[this.currentIndex].getDate();

    this.currentDayWorkoutHistory = this.workoutHistory.filter(
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
    if (!this.isListView) {
      setTimeout(() => {
        this.initCarouselView();
      });
    }
  }
}
