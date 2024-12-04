import { Component, ViewChild } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { WorkoutHistoryDetailsService } from '../../services/communication/workout-history-details.service';
import {
  ContextMenuComponent,
  MenuItem,
} from '../common/context-menu/context-menu.component';
import { sideModalOpenClose } from '../../animations/side-modal-open-close';
import { fadeInOut } from '../../animations/fade-in-out';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../common/action-button/action-button.component';
import { TagsModalComponent } from '../common/tags-modal/tags-modal.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { Exercise } from '../../models/exercise';
import { Sets } from '../../models/set';
import { ToastComponent } from '../common/toast/toast.component';
import { replaceItemInArray } from '../../utils/array-utils';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { SearchExercisesComponent } from '../common/search-exercises/search-exercises.component';
import { collapse } from '../../animations/collapse';
import { Workout } from '../../models/workout';
import { WorkoutTimeSelectorComponent } from '../common/workout-time-selector/workout-time-selector.component';

@Component({
  selector: 'app-workout-history-details',
  standalone: true,
  imports: [
    NgIf,
    HeaderButtonComponent,
    ContextMenuComponent,
    FormsModule,
    ActionButtonComponent,
    NgForOf,
    TagsModalComponent,
    CdkDrag,
    CdkDragHandle,
    MatIcon,
    NgClass,
    CdkDropList,
    ToastComponent,
    ConfirmationModalComponent,
    SearchExercisesComponent,
    DatePipe,
    WorkoutTimeSelectorComponent,
  ],
  templateUrl: './workout-history-details.component.html',
  styleUrl: './workout-history-details.component.scss',
  animations: [fadeInOut, sideModalOpenClose, collapse],
})
export class WorkoutHistoryDetailsComponent {
  protected isOpen: boolean = false;
  protected workout!: Workout;
  protected isEditView: boolean = false;

  protected isInvalidated: boolean = false;
  protected openedAdjustWorkoutTime: boolean = false;

  protected dragStarted: boolean = false;
  protected setsAnimationEnabled: boolean = false;

  protected deleteSetModeForExercise: Exercise | undefined = undefined;
  private setToDelete: any;
  private exerciseToDelete: any;
  private exerciseToReplace: any;

  protected workoutTitle: string = '';
  protected isTitleEditable: boolean = false;

  @ViewChild('workoutContainerMenu')
  workoutContainerMenu!: ContextMenuComponent;

  @ViewChild('editWorkoutTagsModal')
  editWorkoutTagsModal!: TagsModalComponent;

  @ViewChild('deleteSetConfirmationModal')
  deleteSetConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('deleteExerciseConfirmationModal')
  deleteExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('replaceExerciseConfirmationModal')
  replaceExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('exerciseMenu') exerciseMenu!: ContextMenuComponent;

  @ViewChild('workoutMenu') workoutMenu!: ContextMenuComponent;

  @ViewChild('exercisesModal')
  exercisesModal!: SearchExercisesComponent;

  @ViewChild('errorToast')
  errorToast!: ToastComponent;

  constructor(
    private workoutHistoryDetailsService: WorkoutHistoryDetailsService,
  ) {
    this.workoutHistoryDetailsService.modalOpened$.subscribe((wh) => {
      this.workout = wh;
      this.isOpen = true;
      this.isEditView = false;
      this.workoutTitle = this.workout.title;
    });
  }

  onSwipeRight() {
    this.closeModal();
  }

  closeModal() {
    this.isOpen = false;
    this.isEditView = false;
  }

  switchView() {
    this.isEditView = !this.isEditView;
  }

  workoutContainerMenuItems: any = [];

  openWorkoutContainerMenu($event: MouseEvent): void {
    this.workoutContainerMenuItems = [
      {
        label: 'Edit workout',
        icon: 'settings-2',
        action: () => this.openEdit(this.workout),
      },
      {
        label: 'Delete workout',
        icon: 'delete',
        action: () => this.deleteWorkout(this.workout),
      },
    ];

    this.workoutContainerMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: -30,
    });
  }

  private deleteWorkout(workout: Workout) {}

  private openEdit(workout: Workout) {
    this.switchView();
  }

  save() {
    this.switchView();
  }

  calculateIsPR(set: Sets, exercise: Exercise): boolean {
    return exercise.prSet?.id === set.id;
  }

  isSetBetter(set: any): boolean {
    return (
      (set?.weight ?? 0) > (set?.previousWeight ?? 0) ||
      (set?.reps ?? 0) > (set?.previousReps ?? 0)
    );
  }

  isSetWorse(set: any): boolean {
    return (
      (set?.weight ?? 0) < (set?.previousWeight ?? 0) ||
      (set?.reps ?? 0) < (set?.previousReps ?? 0)
    );
  }

  private validateInput() {
    let errorMessages: string[] = [];

    if (
      this.workout?.title === undefined ||
      this.workout?.title?.trim() === ''
    ) {
      errorMessages.push('Workout title must not be empty');
    }

    if (this.workout?.exercises.length === 0) {
      errorMessages.push('Workout must have at least one exercise');
    }

    for (const exercise of this.workout?.exercises || []) {
      if (exercise.sets.length === 0) {
        errorMessages.push(
          `Exercise "${exercise.name}" does not have any sets`,
        );
      }
    }

    return errorMessages;
  }

  openTagsModal() {
    this.editWorkoutTagsModal.show();
  }

  onTagsModalClosed() {}

  drop(event: CdkDragDrop<string[]>) {
    let exercises = this.workout?.exercises!;
    moveItemInArray(exercises, event.previousIndex, event.currentIndex);

    /*    this.workoutService.updateExercisesPositionForWorkout(
      this.workout?.id!,
      exercises.map((e) => e.id!),
    );*/
  }

  onDragEnded() {
    this.dragStarted = false;
  }

  workoutMenuItems = [
    {
      label: 'Reorder exercises',
      icon: 'swap',
      action: () => this.prepareExercisesViewForDrag(),
    },
    {
      label: 'Rename workout',
      icon: 'text',
      action: () => this.makeTitleEditable(),
    },
    {
      label: 'Add exercise',
      icon: 'add-circle',
      action: () => this.addExercise(),
    },
    {
      label: 'Adjust time',
      icon: 'stopwatch',
      action: () => this.adjustTime(),
    },
  ];

  openWorkoutMenu($event: MouseEvent) {
    this.workoutMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: 0,
    });
  }

  makeTitleEditable() {
    this.isTitleEditable = true;
  }

  makeTitleNonEditable() {
    if (this.workoutTitle.length > 0) {
      this.isTitleEditable = false;
      if (this.workout) {
        this.workout.title = this.workoutTitle;
      }
    }
  }

  exerciseMenuItems: MenuItem[] = [];

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
      {
        label: 'Delete sets',
        icon: 'delete',
        action: () => this.openDeleteSetsMode(exercise),
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
    this.setsAnimationEnabled = true;
    setTimeout(() => {
      this.dragStarted = true;
    }, 0);
  }

  addExercise() {
    this.exercisesModal.show(
      this.workout?.exercises?.map((e) => e.id),
      true,
    );
  }

  onAddExercisesSelected(selectedExercises: Exercise[]) {
    if (selectedExercises.length > 0) {
      /* this.workoutService.addExerciseToWorkout(
        this.workout?.id!,
        selectedExercises.map((e) => e.id),
      );*/
      this.workout?.exercises!.push(...selectedExercises);
      this.recalculateProgress();
    }
  }

  private replaceExercise(exercise: Exercise) {
    this.exerciseToReplace = exercise;
    this.replaceExerciseConfirmationModal.show(
      'Current progress on exercise will be lost',
    );
  }

  onReplaceExerciseConfirmed(confirmed: boolean) {
    if (confirmed && this.exerciseToReplace)
      this.exercisesModal.show(
        this.workout?.exercises?.map((e) => e.id),
        false,
        true,
      );
  }

  onReplaceExerciseSelected(exercise: Exercise) {
    /*this.workoutService.replaceExercise(
      this.workout?.id!,
      this.exerciseToReplace.id!,
      exercise.id,
    );*/
    replaceItemInArray(
      this.workout?.exercises!,
      exercise,
      (e) => e.id === this.exerciseToReplace.id,
    );
    this.exerciseToReplace = undefined;
  }

  completeSet(set: any) {
    set.completed = !set.completed;
    //this.setService.completeSet(set.id);
    this.recalculateProgress();
  }

  updateSetWeight(set: Sets, $event: any) {
    const weight = parseInt($event.target.value);
    if (!isNaN(weight)) {
      set.weight = weight;
      //this.setService.updateSetWeight(set.id!, weight);
    }
  }

  updateSetReps(set: Sets, $event: any) {
    const reps = parseInt($event.target.value);
    if (!isNaN(reps)) {
      set.weight = reps;
      //this.setService.updateSetReps(set.id!, reps);
    }
  }

  private recalculateProgress() {
    let totalSets = 0;
    let completedSets = 0;

    this.workout?.exercises?.forEach((exercise) => {
      totalSets += exercise.sets.length;
      completedSets += exercise.sets.filter((s) => s.completed).length;
    });
  }

  addSet(exercise: Exercise) {
    let newSet: Sets = { reps: 0, weight: 0, completed: false };
    /*    this.setService.create(newSet, exercise.id).subscribe((set) => {
      exercise.sets.push(set);
      this.recalculateProgress();
    });*/
    exercise.sets.push(newSet);
  }

  openDeleteSetsMode(exercise: Exercise) {
    this.deleteSetModeForExercise = exercise;
  }

  deleteSet(set: any, index: number, exercise: Exercise) {
    this.deleteSetModeForExercise = exercise;
    this.setToDelete = set;
    if (
      (set.weight === 0 || set.weight === undefined) &&
      (set.reps === 0 || set.reps === undefined)
    ) {
      this.onDeleteSetConfirmed(true);
    } else {
      this.deleteSetConfirmationModal.show(`Set #${index + 1} will be deleted`);
    }
  }

  onDeleteSetConfirmed(confirmed: boolean) {
    if (confirmed && this.deleteSetModeForExercise && this.setToDelete) {
      //this.setService.deleteSet(this.setToDelete.id);
      const index = this.deleteSetModeForExercise!.sets.indexOf(
        this.setToDelete,
      );
      if (index > -1) {
        this.deleteSetModeForExercise!.sets.splice(index, 1);
      }
      this.deleteSetModeForExercise = undefined;
    }
    this.setToDelete = undefined;
  }

  resetSetDelete() {
    this.deleteSetModeForExercise = undefined;
  }

  private removeExercise(exercise: Exercise) {
    this.exerciseToDelete = exercise;
    this.deleteExerciseConfirmationModal.show(
      'Current progress on exercise will be lost',
    );
  }

  onDeleteExerciseConfirmed(confirmed: boolean) {
    if (confirmed && this.exerciseToDelete) {
      const index = this.workout!.exercises!.indexOf(this.exerciseToDelete);
      if (index > -1) {
        this.workout!.exercises!.splice(index, 1);
      }
      /*      this.workoutService.removeExercise(
        this.exerciseToDelete.id!,
        this.workout!.id!,
      );*/
    }
    this.exerciseToDelete = undefined;
  }

  private adjustTime() {
    this.openedAdjustWorkoutTime = true;
  }

  onWorkoutTimeChange(event: { startTime: Date; endTime: Date }) {
    this.workout.startTime = event.startTime;
    this.workout.endTime = event.endTime;
    this.openedAdjustWorkoutTime = false;
  }
}
