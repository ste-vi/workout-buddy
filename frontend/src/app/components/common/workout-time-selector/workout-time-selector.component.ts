import { Component, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { DateTimePickerComponent } from '../slider/date-time-picker/date-time-picker.component';
import {fadeInOut} from "../../../animations/fade-in-out";
import {sideModalOpenClose} from "../../../animations/side-modal-open-close";
import {dialogOpenClose} from "../../../animations/dialog-open-close";

@Component({
  selector: 'app-workout-time-selector',
  templateUrl: './workout-time-selector.component.html',
  standalone: true,
  styleUrls: ['./workout-time-selector.component.scss'],
  imports: [DatePipe, NgIf, DateTimePickerComponent],
  animations: [fadeInOut, dialogOpenClose],
})
export class WorkoutTimeSelectorComponent implements OnInit {
  isOpen: boolean = true;
  startTime: Date;
  endTime: Date;
  activeTimePicker: 'start' | 'end' | null = null;

  constructor() {
    this.startTime = new Date();
    this.endTime = new Date(this.startTime.getTime() + 60 * 60 * 1000); // Default to 1 hour later
  }

  ngOnInit(): void {
    // Any initialization logic
  }

  toggleDateTimePicker(type: 'start' | 'end'): void {
    this.activeTimePicker = this.activeTimePicker === type ? null : type;
  }

  onStartTimeChange(newDateTime: Date): void {
    this.startTime = newDateTime;
    if (this.startTime > this.endTime) {
      this.endTime = new Date(this.startTime.getTime() + 60 * 60 * 1000);
    }
  }

  onEndTimeChange(newDateTime: Date): void {
    this.endTime = newDateTime;
    if (this.endTime < this.startTime) {
      this.startTime = new Date(this.endTime.getTime() - 60 * 60 * 1000);
    }
  }

  getDuration(): string {
    const durationMs = this.endTime.getTime() - this.startTime.getTime();
    const durationMinutes = Math.round(durationMs / (60 * 1000));
    return `${durationMinutes} min`;
  }

  close(): void {
    this.isOpen = false;
    this.activeTimePicker = null;
  }

  open(): void {
    this.isOpen = true;
  }
}
