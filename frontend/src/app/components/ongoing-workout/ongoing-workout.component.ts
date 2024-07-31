import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { workoutTemplates } from '../../services/api/dummy-data/workflow-templates-dummy-daya';
import { MatIcon } from '@angular/material/icon';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import {
  ContextMenuComponent,
  MenuItem,
} from '../common/context-menu/context-menu.component';
import { Exercise } from '../../models/exercise';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ProgressBarComponent } from '../common/progress-bar/progress-bar.component';

@Component({
  selector: 'app-ongoing-workout',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    NgIf,
    MatIcon,
    NgForOf,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    CdkDragPreview,
    CdkDragPlaceholder,
    CdkScrollable,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    CdkMenuTrigger,
    CdkMenuItem,
    CdkMenu,
    ContextMenuComponent,
    MatProgressBar,
    NgStyle,
    ProgressBarComponent,
  ],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          height: 0,
          opacity: 0,
        }),
      ),
      transition(':leave', [animate('250ms ease')]),
    ]),
  ],
  templateUrl: './ongoing-workout.component.html',
  styleUrl: './ongoing-workout.component.scss',
})
export class OngoingWorkoutComponent implements OnInit, AfterViewInit {
  protected isOpen: boolean = true;
  protected isTemplateUpdated: boolean = true;
  protected workoutTemplate = workoutTemplates[1];
  protected dragStarted: boolean = false;
  protected progress: number = 0.3;
  protected isComplete: boolean = this.progress == 1.0;

  @ViewChild('workoutMenu') workoutMenu!: ContextMenuComponent;
  @ViewChild('exerciseMenu') exerciseMenu!: ContextMenuComponent;

  constructor(private ongoingWorkoutService: OngoingWorkoutService) {}

  ngOnInit(): void {
    this.ongoingWorkoutService.modalOpened$.subscribe((wt) => {
      this.isOpen = true;
      this.workoutTemplate = wt;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.workoutTemplate.exercises,
      event.previousIndex,
      event.currentIndex,
    );
  }

  onDragEnded() {
    this.dragStarted = false;
  }

  ngAfterViewInit(): void {}

  workoutMenuItems = [
    {
      label: 'Reorder exercises',
      icon: 'swap',
      action: () => this.prepareExercisesViewForDrag(),
    },
    {
      label: 'Add exercise',
      icon: 'add-circle',
      action: () => this.addExercise(),
    },
    {
      label: 'Reset timer',
      icon: 'stopwatch',
      action: () => this.addExercise(),
    },
  ];

  exerciseMenuItems: MenuItem[] = [];

  openWorkoutMenu($event: MouseEvent) {
    this.workoutMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: 0,
    });
  }

  openExerciseMenu($event: MouseEvent, exercise: Exercise) {
    this.exerciseMenuItems = [
      {
        label: 'Replace exercise',
        icon: 'transfer',
        action: () => this.replaceExercise(exercise),
      },
      {
        label: 'Remove exercise',
        icon: 'delete',
        action: () => this.removeExercise(exercise),
      },
    ];

    this.exerciseMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: 0,
    });
  }

  prepareExercisesViewForDrag() {
    this.dragStarted = true;
  }

  addExercise() {}

  private replaceExercise(exercise: Exercise) {}

  private removeExercise(exercise: Exercise) {}

  stopWorkout() {
    this.isOpen = false;
    this.dragStarted = false;
    this.isTemplateUpdated = false;
  }

  finishWorkout() {
    this.progress = this.progress + 0.1 // temp
  }
}
