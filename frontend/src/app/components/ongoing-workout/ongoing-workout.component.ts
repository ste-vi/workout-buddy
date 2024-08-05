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
import { MatProgressBar } from '@angular/material/progress-bar';
import { ProgressBarComponent } from '../common/progress-bar/progress-bar.component';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { collapse } from '../../animations/collapse';
import { WorkoutService } from '../../services/api/workout.service';
import { Workout } from '../../models/workout';
import { WorkoutTemplate } from '../../models/workout-template';
import { TagsModalComponent } from '../common/tags-modal/tags-modal.component';
import { Sets } from '../../models/set';
import { SetService } from '../../services/api/set-service';
import { TagService } from '../../services/api/tag.service';
import { sideModalOpenClose } from '../../animations/side-modal-open-close';
import { fadeInOut } from '../../animations/fade-in-out';
import { ExercisesComponent } from '../common/exercises/exercises.component';

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
    ConfirmationModalComponent,
    TagsModalComponent,
    ExercisesComponent,
  ],
  animations: [collapse, sideModalOpenClose, fadeInOut],
  templateUrl: './ongoing-workout.component.html',
  styleUrl: './ongoing-workout.component.scss',
})
export class OngoingWorkoutComponent implements OnInit, AfterViewInit {
  protected isOpen: boolean = true;

  protected isTemplateUpdated: boolean = false;
  protected ongoingWorkout: Workout | undefined = undefined;

  protected progress: number = 0.0;

  protected dragStarted: boolean = false;
  protected setsAnimationEnabled: boolean = false;

  protected deleteSetModeForExercise: Exercise | undefined = undefined;
  private setToDelete: any;
  private exerciseToDelete: any;

  @ViewChild('deleteSetConfirmationModal')
  deleteSetConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('deleteExerciseConfirmationModal')
  deleteExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('editWorkoutTagsModal')
  editWorkoutTagsModal!: TagsModalComponent;

  @ViewChild('addExercisesModal')
  addExercisesModal!: ExercisesComponent;

  @ViewChild('workoutMenu') workoutMenu!: ContextMenuComponent;

  @ViewChild('exerciseMenu') exerciseMenu!: ContextMenuComponent;

  constructor(
    private ongoingWorkoutService: OngoingWorkoutService,
    private workoutService: WorkoutService,
    private setService: SetService,
    private tagService: TagService,
  ) {}

  ngOnInit(): void {
    this.ongoingWorkoutService.modalOpened$.subscribe((wt) => {
      this.startNewWorkout(wt);
      this.isOpen = true; // open only after workout creation is submitted from BE?
    });

    // temp
    this.startNewWorkout(workoutTemplates[1]);
  }

  ngAfterViewInit(): void {}

  private startNewWorkout(wt: WorkoutTemplate) {
    this.workoutService.startWorkout(wt).subscribe((workout) => {
      this.ongoingWorkout = workout;
      this.progress = 0.0;
    });
  }

  stopWorkout() {
    this.isOpen = false;
    this.dragStarted = false;
    this.isTemplateUpdated = false;
    this.deleteSetModeForExercise = undefined;
  }

  finishWorkout() {}

  drop(event: CdkDragDrop<string[]>) {
    let exercises = this.ongoingWorkout?.exercises!;
    moveItemInArray(exercises, event.previousIndex, event.currentIndex);

    this.workoutService.updateExercisesPositionForWorkout(
      this.ongoingWorkout?.id!,
      exercises.map((e) => e.id!),
    );
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
    this.addExercisesModal.show(
      this.ongoingWorkout?.exercises?.map((e) => e.id),
    );
  }

  onAddExercisesSelected(selectedExercises: Exercise[]) {
    if (selectedExercises.length > 0) {
      this.workoutService.addExerciseToWorkout(
        this.ongoingWorkout?.id!,
        selectedExercises.map((e) => e.id),
      );
      this.ongoingWorkout?.exercises!.push(...selectedExercises);
      this.recalculateProgress();
    }
  }

  private replaceExercise(exercise: Exercise) {
    this.recalculateProgress();
  }

  completeSet(set: any) {
    set.completed = !set.completed;
    this.setService.completeSet(set.id);
    this.recalculateProgress();
  }

  updateSetWeight(set: Sets, $event: any) {
    const weight = parseInt($event.target.value);
    if (!isNaN(weight)) {
      set.weight = weight;
      this.setService.updateSetWeight(set.id!, weight);
    }
  }

  updateSetReps(set: Sets, $event: any) {
    const reps = parseInt($event.target.value);
    if (!isNaN(reps)) {
      set.weight = reps;
      this.setService.updateSetReps(set.id!, reps);
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

  addSet(exercise: Exercise) {
    let newSet: Sets = { reps: 0, weight: 0, completed: false };
    this.setService.create(newSet, exercise.id).subscribe((set) => {
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
      this.deleteSetConfirmationModal.show(
        `Are you sure to delete set #${index + 1}?`,
      );
    }
  }

  onDeleteSetConfirmed(confirmed: boolean) {
    if (confirmed && this.deleteSetModeForExercise && this.setToDelete) {
      this.setService.deleteSet(this.setToDelete.id);
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
      'Are you sure? Current progress on exercise will be lost',
    );
  }

  onDeleteExerciseConfirmed(confirmed: boolean) {
    if (confirmed && this.exerciseToDelete) {
      const index = this.ongoingWorkout!.exercises!.indexOf(
        this.exerciseToDelete,
      );
      if (index > -1) {
        this.ongoingWorkout!.exercises!.splice(index, 1);
      }
      this.workoutService.removeExercise(
        this.exerciseToDelete.id!,
        this.ongoingWorkout!.id!,
      );
    }
    this.exerciseToDelete = undefined;
  }

  openTagsModal() {
    this.editWorkoutTagsModal.show();
  }

  onTagsModalClosed() {
    this.tagService
      .updateTags(this.ongoingWorkout!.tags!, this.ongoingWorkout!.id!)
      .subscribe((tags) => {
        this.ongoingWorkout!.tags = tags;
      });
  }
}
