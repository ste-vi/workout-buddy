import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import KeenSlider, { KeenSliderInstance, KeenSliderOptions } from 'keen-slider';
import 'keen-slider/keen-slider.min.css';
import { MatIcon } from '@angular/material/icon';

interface SliderData {
  values: string[];
  currentIndex: number;
}

type SliderKey = 'days' | 'months' | 'hours' | 'minutes';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  standalone: true,
  styleUrls: ['./date-time-picker.component.scss'],
  imports: [NgForOf, FormsModule, MatIcon, NgIf],
})
export class DateTimePickerComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild('daysSlider') daysSliderRef!: ElementRef<HTMLElement>;
  @ViewChild('monthsSlider') monthsSliderRef!: ElementRef<HTMLElement>;
  @ViewChild('hoursSlider') hoursSliderRef!: ElementRef<HTMLElement>;
  @ViewChild('minutesSlider') minutesSliderRef!: ElementRef<HTMLElement>;

  @Input() initialDateTime: Date = new Date();
  @Input() showDate: boolean = true;
  @Input() showTime: boolean = true;
  @Output() dateTimeChange = new EventEmitter<Date>();

  days: SliderData = { values: [], currentIndex: 0 };
  months: SliderData = { values: [], currentIndex: 0 };
  hours: SliderData = { values: [], currentIndex: 0 };
  minutes: SliderData = { values: [], currentIndex: 0 };

  currentYear: number;

  protected sliders: Record<SliderKey, KeenSliderInstance | null> = {
    days: null,
    months: null,
    hours: null,
    minutes: null,
  };

  constructor(private cdr: ChangeDetectorRef) {
    this.currentYear = this.initialDateTime.getFullYear();
  }

  ngOnInit(): void {
    if (this.initialDateTime) {
      this.initialDateTime = new Date(this.initialDateTime);
    }
    this.initializeSliderData();
  }

  ngAfterViewInit(): void {
    this.initializeSliders();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    Object.values(this.sliders).forEach((slider) => slider?.destroy());
  }

  private initializeSliderData(): void {
    this.days.values = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
    this.months.values = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    this.hours.values = Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, '0')}`,
    );
    this.minutes.values = Array.from(
      { length: 60 },
      (_, i) => `${i.toString().padStart(2, '0')}`,
    );

    if (this.showDate) {
      console.log(this.initialDateTime);
      this.currentYear = this.initialDateTime.getFullYear();
      this.months.currentIndex = this.initialDateTime.getMonth();
      this.days.currentIndex = this.initialDateTime.getDate() - 1;
    }
    if (this.showTime) {
      this.hours.currentIndex = this.initialDateTime.getHours();
      this.minutes.currentIndex = this.initialDateTime.getMinutes();
    }
  }

  private initializeSliders(): void {
    const sliderOptions: KeenSliderOptions = {
      loop: true,
      vertical: true,
      slides: { perView: 5, origin: 'center' },
      initial: 0,
      slideChanged: (s) => {
        this.updateDateTime();
      },
    };

    if (this.showDate) {
      this.sliders.days = new KeenSlider(this.daysSliderRef.nativeElement, {
        ...sliderOptions,
        initial: this.days.currentIndex,
      });
      this.sliders.months = new KeenSlider(this.monthsSliderRef.nativeElement, {
        ...sliderOptions,
        initial: this.months.currentIndex,
      });
    }

    if (this.showTime) {
      this.sliders.hours = new KeenSlider(this.hoursSliderRef.nativeElement, {
        ...sliderOptions,
        initial: this.hours.currentIndex,
      });
      this.sliders.minutes = new KeenSlider(
        this.minutesSliderRef.nativeElement,
        {
          ...sliderOptions,
          initial: this.minutes.currentIndex,
        },
      );
    }
  }

  private updateDateTime(): void {
    const selectedDate = new Date(
      this.currentYear,
      this.sliders.months?.track.details.abs ?? 0,
      parseInt(this.days.values[this.sliders.days?.track.details.abs ?? 0]),
      parseInt(this.hours.values[this.sliders.hours?.track.details.abs ?? 0]),
      parseInt(
        this.minutes.values[this.sliders.minutes?.track.details.abs ?? 0],
      ),
    );

    this.dateTimeChange.emit(selectedDate);
  }

  changeYear(delta: number): void {
    this.currentYear += delta;
    this.updateDateTime();
  }
}
