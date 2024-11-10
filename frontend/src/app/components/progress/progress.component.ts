import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { DateTimePickerComponent } from '../common/slider/date-time-picker/date-time-picker.component';
import { format, subDays } from 'date-fns';
import {WorkoutTimeSelectorComponent} from "../common/workout-time-selector/workout-time-selector.component";

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [NgStyle, DateTimePickerComponent, WorkoutTimeSelectorComponent],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  selectedDate: Date = new Date();

  onDateTimeChange(date: Date) {
    console.log('Selected date:', date);
    this.selectedDate = date;
  }
}
