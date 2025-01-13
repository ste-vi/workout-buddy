import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  ContextMenuComponent,
  MenuItem,
} from '../common/context-menu/context-menu.component';
import {
  Exercise,
  getBodyPartDisplayName,
  getCategoryDisplayName,
} from '../../models/exercise';
import { ProgressBarComponent } from '../common/progress-bar/progress-bar.component';
import { ConfirmationModalComponent } from '../common/modal/confirmation-modal/confirmation-modal.component';
import { collapse } from '../../animations/collapse';
import { WorkoutService } from '../../services/api/workout.service';
import { Workout } from '../../models/workout';
import { TagsModalComponent } from '../common/modal/tags-modal/tags-modal.component';
import { Sets } from '../../models/set';
import { sideModalOpenClose } from '../../animations/side-modal-open-close';
import { fadeInOut } from '../../animations/fade-in-out';
import { SearchExercisesComponent } from '../common/search-exercises/search-exercises.component';
import { replaceItemInArray } from '../../utils/array-utils';
import { ToastComponent } from '../common/toast/toast.component';
import { ActionButtonComponent } from '../common/action-button/action-button.component';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    ContextMenuComponent,
    ProgressBarComponent,
    ConfirmationModalComponent,
    TagsModalComponent,
    SearchExercisesComponent,
    ToastComponent,
    NgClass,
    ActionButtonComponent,
  ],
  animations: [collapse, sideModalOpenClose, fadeInOut],
  templateUrl: './ongoing-workout.component.html',
  styleUrl: './ongoing-workout.component.scss',
})
export class OngoingWorkoutComponent implements OnInit, OnDestroy {
  protected isOpen: boolean = false;

  protected isTemplateUpdated: boolean = false;
  protected ongoingWorkout: Workout | undefined = undefined;

  protected progress: number = 0.0;

  protected dragStarted: boolean = false;
  protected setsAnimationEnabled: boolean = false;

  protected isInvalidated: boolean = false;

  protected deleteSetModeForExercise: Exercise | undefined = undefined;
  private setToDelete: Sets | undefined = undefined;
  private exerciseToDelete: any;
  private exerciseToReplace: any;

  @ViewChild('deleteSetConfirmationModal')
  deleteSetConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('deleteExerciseConfirmationModal')
  deleteExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('replaceExerciseConfirmationModal')
  replaceExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('cancelWorkoutConfirmationModal')
  cancelWorkoutConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('resetTimerConfirmationModal')
  resetTimerConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('finishWorkoutConfirmationModal')
  finishWorkoutConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('editWorkoutTagsModal')
  editWorkoutTagsModal!: TagsModalComponent;

  @ViewChild('exercisesModal')
  exercisesModal!: SearchExercisesComponent;

  @ViewChild('workoutMenu') workoutMenu!: ContextMenuComponent;

  @ViewChild('exerciseMenu') exerciseMenu!: ContextMenuComponent;

  @ViewChild('errorToast')
  errorToast!: ToastComponent;

  protected formattedTime: string = '';
  private timerSubscription: Subscription | null = null;

  constructor(
    private ongoingWorkoutService: OngoingWorkoutService,
    private workoutService: WorkoutService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.ongoingWorkoutService.modalOpened$.subscribe((workout) => {
      this.ongoingWorkout = new Workout(workout);
      this.recalculateProgress();
      this.isInvalidated = false;
      this.startTimer();
      this.isOpen = true;
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    const startTime = new Date(this.ongoingWorkout!.startTime).getTime();
    this.timerSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      const duration = now - startTime;
      this.formattedTime = this.formatDuration(duration);
    });
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    } else {
      return `${this.pad(minutes)}:${this.pad(seconds)}`;
    }
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  cancelWorkout() {
    this.cancelWorkoutConfirmationModal.show(
      'Ongoing workout will be deleted, current progress will be lost',
    );
  }

  onCancelWorkoutConfirmed(confirmed: boolean) {
    if (confirmed) {
      this.workoutService
        .deleteWorkout(this.ongoingWorkout!.id!)
        .subscribe(() => {
          this.close();
        });
    }
  }

  private close() {
    this.isOpen = false;
    this.dragStarted = false;
    this.isTemplateUpdated = false;
    this.deleteSetModeForExercise = undefined;
    this.isInvalidated = false;
    this.stopTimer();
  }

  finishWorkout() {
    let errorMessages: string[] = this.validateInput();

    let isValid = errorMessages.length === 0;

    this.isInvalidated = !isValid;
    if (!isValid) {
      this.errorToast.open('Error', errorMessages, 'danger');
      return;
    }

    if (this.progress < 1) {
      this.finishWorkoutConfirmationModal.show(
        'Not all of the sets completed, are you sure you want to finish the workout now?',
      );
    } else {
      this.doFinishWorkout();
    }
  }

  private doFinishWorkout() {
    this.ongoingWorkout!.calculateTotalWeight();
    let totalWeight = this.ongoingWorkout!.totalWeight;
    if (totalWeight === 0) {
      totalWeight = undefined;
    }
    this.workoutService
      .completeWorkout(
        this.ongoingWorkout!.id!,
        this.ongoingWorkout!.totalWeight,
      )
      .subscribe((date) => {
        this.ongoingWorkout!.calculateTotalSets();
        this.ongoingWorkout!.totalWeight = totalWeight;
        this.ongoingWorkout!.endTime = new Date(date);
        this.close();
        this.router.navigate(['/dashboard']).then((r) => {});
      });
  }

  private validateInput() {
    let errorMessages: string[] = [];

    if (
      this.ongoingWorkout?.exercises === undefined ||
      this.ongoingWorkout?.exercises?.length === 0
    ) {
      errorMessages.push('Template must have at least one exercise');
    }

    for (const exercise of this.ongoingWorkout?.exercises || []) {
      if (exercise.sets.length === 0) {
        errorMessages.push(
          `Exercise "${exercise.name}" does not have any sets`,
        );
      }
    }

    return errorMessages;
  }

  drop(event: CdkDragDrop<string[]>) {
    let exercises = this.ongoingWorkout?.exercises!;
    moveItemInArray(exercises, event.previousIndex, event.currentIndex);
    this.updateExercisesPositions();
  }

  private updateExercisesPositions() {
    this.ongoingWorkout!.exercises!.forEach((exercise, index) => {
      exercise.position = index;
    });

    this.workoutService
      .updateExercisesPositionForWorkout(
        this.ongoingWorkout?.id!,
        this.ongoingWorkout!.exercises.map((e) => ({
          id: e.id!,
          position: e.position!,
        })),
      )
      .subscribe(() => {});
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
      label: 'Add exercise',
      icon: 'add-circle',
      action: () => this.addExercise(),
    },
    {
      label: 'Reset timer',
      icon: 'stopwatch',
      action: () => this.resetTimer(),
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
      this.ongoingWorkout?.exercises?.map((e) => e.id!),
      true,
    );
  }

  onAddExercisesSelected(selectedExercises: Exercise[]) {
    if (selectedExercises.length > 0) {
      this.ongoingWorkout?.exercises!.push(...selectedExercises);
      this.updateExercisesPositions();
      this.workoutService
        .addExerciseToWorkout(
          this.ongoingWorkout?.id!,
          selectedExercises.map((e) => ({ id: e.id!, position: e.position! })),
        )
        .subscribe(() => {
          this.recalculateProgress();
        });
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
        this.ongoingWorkout?.exercises?.map((e) => e.id!),
        false,
        true,
      );
  }

  onReplaceExerciseSelected(exercise: Exercise) {
    exercise.position = this.exerciseToReplace.position!;
    this.workoutService
      .replaceExercise(
        this.ongoingWorkout?.id!,
        this.exerciseToReplace.id!,
        exercise.id,
      )
      .subscribe(() => {
        replaceItemInArray(
          this.ongoingWorkout?.exercises!,
          exercise,
          (e) => e.id === this.exerciseToReplace.id,
        );
        this.exerciseToReplace = undefined;
      });
  }

  completeSet(exercise: Exercise, set: Sets) {
    this.workoutService
      .completeSet(this.ongoingWorkout?.id!, exercise.id!, set.id!)
      .subscribe(() => {
        set.completed = !set.completed;
        this.recalculateProgress();
      });
  }

  updateSetWeight(exercise: Exercise, set: Sets, $event: any) {
    const weight = parseInt($event.target.value);
    if (!isNaN(weight)) {
      set.weight = weight;
      this.workoutService
        .updateSetWeight(
          this.ongoingWorkout?.id!,
          exercise.id!,
          set.id!,
          weight,
        )
        .subscribe(() => {});
    }
  }

  updateSetReps(exercise: Exercise, set: Sets, $event: any) {
    const reps = parseInt($event.target.value);
    if (!isNaN(reps)) {
      set.reps = reps;
      this.workoutService
        .updateSetReps(this.ongoingWorkout?.id!, exercise.id!, set.id!, reps)
        .subscribe(() => {});
    }
  }

  addSet(exercise: Exercise) {
    let newSet: Sets = {
      reps: 0,
      weight: 0,
      completed: false,
      personalRecord: false,
    };
    this.workoutService
      .addSet(this.ongoingWorkout?.id!, exercise.id!, newSet)
      .subscribe((set) => {
        exercise.sets.push(set);
        this.recalculateProgress();
      });
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
      this.workoutService
        .deleteSet(this.ongoingWorkout?.id!, this.setToDelete.id!)
        .subscribe(() => {
          const index = this.deleteSetModeForExercise!.sets.indexOf(
            this.setToDelete!,
          );
          if (index > -1) {
            this.deleteSetModeForExercise!.sets.splice(index, 1);
          }
          this.recalculateProgress();
          this.setToDelete = undefined;
        });
    } else {
      this.setToDelete = undefined;
    }
  }

  private recalculateProgress() {
    let totalSets = 0;
    let completedSets = 0;

    this.ongoingWorkout?.exercises?.forEach((exercise) => {
      totalSets += exercise.sets.length;
      completedSets += exercise.sets.filter((s) => s.completed).length;
    });

    this.progress = totalSets > 0 ? completedSets / totalSets : 0;
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
      this.workoutService
        .removeExercise(this.exerciseToDelete.id!, this.ongoingWorkout!.id!)
        .subscribe(() => {
          const index = this.ongoingWorkout!.exercises!.indexOf(
            this.exerciseToDelete,
          );
          if (index > -1) {
            this.ongoingWorkout!.exercises!.splice(index, 1);
          }
          this.exerciseToDelete = undefined;
        });
    }
  }

  openTagsModal() {
    this.editWorkoutTagsModal.show();
  }

  onTagsModalClosed() {
    this.workoutService
      .updateTagsForWorkout(
        this.ongoingWorkout!.id!,
        this.ongoingWorkout!.tags!,
      )
      .subscribe((tags) => {
        this.ongoingWorkout!.tags = tags;
      });
  }

  resetTimer() {
    this.resetTimerConfirmationModal.show();
  }

  onResetTimerConfirmed(confirmed: boolean) {
    if (confirmed) {
      this.workoutService
        .resetTimer(this.ongoingWorkout!.id!)
        .subscribe((newStartTime) => {
          this.ongoingWorkout!.startTime = newStartTime;
          this.stopTimer();
          this.startTimer();
        });
    }
  }

  onFinishWorkoutConfirmed(confirmed: boolean) {
    if (confirmed) {
      this.doFinishWorkout();
    }
  }

  protected readonly getBodyPartDisplayName = getBodyPartDisplayName;

  protected readonly getCategoryDisplayName = getCategoryDisplayName;
}
