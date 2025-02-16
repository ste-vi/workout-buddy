import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgForOf } from '@angular/common';
import { ActionButtonComponent } from '../../action-button/action-button.component';
import { WorkoutService } from '../../../../services/api/workout.service';
import { WorkoutHistoryPreview } from '../../../../models/workout-history-preview';
import { WorkoutHistoryPreviewModalComponent } from './workout-history-preview-modal/workout-history-preview-modal.component';

@Component({
  selector: 'app-workouts-calendar',
  templateUrl: './workouts-calendar.component.html',
  standalone: true,
  styleUrls: ['./workouts-calendar.component.scss'],
  imports: [
    DatePipe,
    ActionButtonComponent,
    NgForOf,
    WorkoutHistoryPreviewModalComponent,
  ],
})
export class WorkoutsCalendarComponent implements OnInit {
  currentMonth: Date = new Date();
  calendarDays: Date[] = [];
  daysOfWeek: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  today: Date = new Date();
  workoutHistoryPreviews: WorkoutHistoryPreview[] = [];

  @ViewChild('workoutHistoryPreviewModal')
  workoutHistoryPreviewModal!: WorkoutHistoryPreviewModalComponent;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.generateCalendarDays();
    this.fetchWorkoutDays();
  }

  generateCalendarDays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) {
      startingDayOfWeek = 6;
    }

    this.calendarDays = [];

    this.addPreviousMonthDays(startingDayOfWeek, year, month);
    this.addCurrentMonthDays(daysInMonth, year, month);
    this.addNextMonthDays(year, month);
  }

  private addPreviousMonthDays(
    startingDayOfWeek: number,
    year: number,
    month: number,
  ) {
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = new Date(year, month, -startingDayOfWeek + i + 1);
      this.calendarDays.push(day);
    }
  }

  private addCurrentMonthDays(
    daysInMonth: number,
    year: number,
    month: number,
  ) {
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      this.calendarDays.push(day);
    }
  }

  private addNextMonthDays(year: number, month: number) {
    const remainingDays = 7 - (this.calendarDays.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const day = new Date(year, month + 1, i);
        this.calendarDays.push(day);
      }
    }
  }

  hasWorkout(day: Date): boolean {
    return this.workoutHistoryPreviews.some(
      (preview) => preview.endTime.toDateString() === day.toDateString(),
    );
  }

  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1,
    );
    this.generateCalendarDays();
    this.fetchWorkoutDays();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1,
    );
    this.generateCalendarDays();
    this.fetchWorkoutDays();
  }

  isCurrentDay(day: Date): boolean {
    return day.toDateString() === this.today.toDateString();
  }

  fetchWorkoutDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const startDate = new Date(Date.UTC(year, month, 1));
    const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    this.workoutService
      .getWorkoutHistoryPreviews(startDate, endDate)
      .subscribe((previews) => {
        this.workoutHistoryPreviews = previews.map(
          (p) => new WorkoutHistoryPreview(p),
        );
      });
  }

  openViewModal(day: Date) {
    if (!this.hasWorkout(day)) {
      return;
    }
    const workoutHistoryPreviews = this.workoutHistoryPreviews.filter(
      (preview) => preview.endTime.toDateString() === day.toDateString(),
    );
    this.workoutHistoryPreviewModal.show(day, workoutHistoryPreviews);
  }
}
