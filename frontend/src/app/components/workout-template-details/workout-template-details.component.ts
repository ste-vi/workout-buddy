import { AfterViewInit, Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { WorkoutTemplateDetailsService } from '../../services/communication/workout-template-details.service';
import { WorkoutTemplate } from '../../models/workout-template';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '../common/button/button.component';
import {TimeAgoPipe} from "../../pipes/time-ago-pipe";

@Component({
  selector: 'app-workout-template-details',
  standalone: true,
  imports: [
    NgIf,
    HeaderButtonComponent,
    MatIcon,
    ButtonComponent,
    NgForOf,
    TimeAgoPipe,
  ],
  templateUrl: './workout-template-details.component.html',
  styleUrl: './workout-template-details.component.scss',
})
export class WorkoutTemplateDetailsComponent implements OnInit, AfterViewInit {
  protected isOpen: boolean = false;
  protected template: WorkoutTemplate | any = undefined;

  constructor(
    private workoutTemplateDetailsService: WorkoutTemplateDetailsService,
  ) {}

  ngOnInit(): void {
    this.workoutTemplateDetailsService.modalOpened$.subscribe((template) => {
      this.template = template;
      this.isOpen = true;
    });
  }

  ngAfterViewInit(): void {
    this.initOverflowingContainerEvent();
  }

  private initOverflowingContainerEvent() {
    const container = document.querySelector(
      '.workout-template-details-container',
    );
    if (container) {
      container.addEventListener('scroll', () => {
        console.log( container.scrollTop + container.clientHeight <=
          container.scrollHeight)
        if (
          container.scrollTop + container.clientHeight <=
          container.scrollHeight
        ) {
          container.classList.add('overflowing');
        } else {
          container.classList.remove('overflowing');
        }
      });
    }
  }

  closeModal() {
    this.isOpen = false;
  }

  onSwipeRight() {
    this.isOpen = false;
  }
}
