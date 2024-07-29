import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { NgForOf, NgIf } from '@angular/common';
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
import {ContextMenuComponent, MenuItem} from '../common/context-menu/context-menu.component';
import {Exercise} from "../../models/exercise";

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
  ],
  templateUrl: './ongoing-workout.component.html',
  styleUrl: './ongoing-workout.component.scss',
})
export class OngoingWorkoutComponent implements OnInit, AfterViewInit {
  protected isOpen: boolean = true;
  protected isTemplateUpdated: boolean = true;
  protected workoutTemplate = workoutTemplates[1];
  protected dragStarted: boolean = false;

  @ViewChild('workoutMenu') workoutMenu!: ContextMenuComponent;
  @ViewChild('exerciseMenu') exerciseMenu!: ContextMenuComponent;

  constructor(private ongoingWorkoutService: OngoingWorkoutService) {}

  ngOnInit(): void {
    this.ongoingWorkoutService.modalOpened$.subscribe((wt) => {
      this.isOpen = true;
      this.workoutTemplate = wt;
    });
  }

  stopWorkout() {
    this.isOpen = false;
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
      action: () => this.prepareExercisesViewForDrag(),
    },
    { label: 'Add new exercise', action: () => this.addExercise() },
  ];

  exerciseMenuItems : MenuItem[] = [];

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
        action: () => this.replaceExercise(exercise),
      },
      { label: 'Remove exercise', action: () => this.removeExercise(exercise) }
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

  private removeExercise(exercise: Exercise) {

  }
}
