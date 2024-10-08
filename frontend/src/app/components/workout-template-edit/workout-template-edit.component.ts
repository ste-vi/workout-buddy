import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { fadeInOut } from '../../animations/fade-in-out';
import { sideModalOpenClose } from '../../animations/side-modal-open-close';
import { WorkoutTemplate } from '../../models/workout-template';
import { Exercise } from '../../models/exercise';
import { WorkoutTemplateService } from '../../services/api/workout-template.service';
import { suggestedWorkoutTemplate } from '../../services/api/dummy-data/workflow-templates-dummy-daya';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { TagsModalComponent } from '../common/tags-modal/tags-modal.component';
import { collapse } from '../../animations/collapse';
import { Sets } from '../../models/set';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import {
  ContextMenuComponent,
  MenuItem,
} from '../common/context-menu/context-menu.component';
import { replaceItemInArray } from '../../utils/array-utils';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../common/toast/toast.component';
import { SearchExercisesComponent } from '../common/search-exercises/search-exercises.component';
import {ActionButtonComponent} from "../common/action-button/action-button.component";

@Component({
  selector: 'app-workout-template-edit',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    NgIf,
    MediumButtonComponent,
    CdkDrag,
    CdkDragHandle,
    MatIcon,
    NgForOf,
    TagsModalComponent,
    CdkDropList,
    ConfirmationModalComponent,
    ContextMenuComponent,
    SearchExercisesComponent,
    FormsModule,
    NgClass,
    ToastComponent,
    ActionButtonComponent,
  ],
  templateUrl: './workout-template-edit.component.html',
  styleUrl: './workout-template-edit.component.scss',
  animations: [fadeInOut, sideModalOpenClose, collapse],
})
export class WorkoutTemplateEditComponent implements OnInit {
  protected isOpen: boolean = false;
  protected isEdit: boolean = false;

  protected template: WorkoutTemplate | undefined = suggestedWorkoutTemplate;

  @Output() createdTemplate: any = new EventEmitter<WorkoutTemplate>();
  @Output() updatedTemplate: any = new EventEmitter<WorkoutTemplate>();

  protected dragStarted: boolean = false;
  protected setsAnimationEnabled: boolean = false;

  private deleteSetModeForExercise: Exercise | undefined = undefined;
  private setToDelete: any;
  private exerciseToDelete: any;
  private exerciseToReplace: any;

  protected templateTitle: string = '';
  protected isTitleEditable: boolean = false;

  protected isInvalidated: boolean = false;

  @ViewChild('editTemplateTagsModal')
  editTemplateTagsModal!: TagsModalComponent;

  @ViewChild('deleteSetConfirmationModal')
  deleteSetConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('deleteExerciseConfirmationModal')
  deleteExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('replaceExerciseConfirmationModal')
  replaceExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('exerciseMenu') exerciseMenu!: ContextMenuComponent;

  @ViewChild('templateMenu') workoutMenu!: ContextMenuComponent;

  @ViewChild('exercisesModal')
  exercisesModal!: SearchExercisesComponent;

  @ViewChild('errorToast')
  errorToast!: ToastComponent;

  constructor(private workoutTemplateService: WorkoutTemplateService) {}

  ngOnInit(): void {}

  show(template?: WorkoutTemplate) {
    if (template) {
      this.isEdit = true;
      this.template = { ...template };
      this.templateTitle = this.template.title;
      this.isTitleEditable = false;
    } else {
      this.isEdit = false;
      this.template = this.initNewTemplate();
      this.templateTitle = '';
      this.isTitleEditable = true;
    }
    this.isInvalidated = false;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  private initNewTemplate(): WorkoutTemplate {
    return {
      id: undefined,
      title: '',
      description: '',
      exercises: [],
      estimatedDuration: undefined,
      totalSets: 0,
      lastPerformedWorkout: undefined,
      tags: [],
      volumeTrend: undefined,
    };
  }

  save() {
    let errorMessages: string[] = this.validateInput();

    let isValid = errorMessages.length === 0;

    this.isInvalidated = !isValid;
    if (!isValid) {
      this.errorToast.open('Error', errorMessages, 'danger');
      return;
    }

    if (this.isEdit) {
      this.workoutTemplateService
        .updateWorkoutTemplate(this.template!)
        .subscribe((updatedTemplate) => {
          this.updatedTemplate.emit(updatedTemplate);
          this.close();
        });
    } else {
      this.workoutTemplateService
        .createWorkoutTemplate(this.template!)
        .subscribe((createdTemplate) => {
          this.createdTemplate.emit(createdTemplate);
          this.close();
        });
    }
  }

  private validateInput() {
    let errorMessages: string[] = [];

    if (
      this.template?.title === undefined ||
      this.template?.title?.trim() === ''
    ) {
      errorMessages.push('Template title must not be empty');
    }

    if (this.template?.exercises.length === 0) {
      errorMessages.push('Template must have at least one exercise');
    }

    for (const exercise of this.template?.exercises || []) {
      if (exercise.sets.length === 0) {
        errorMessages.push(
          `Exercise "${exercise.name}" does not have any sets`,
        );
      }
    }

    return errorMessages;
  }

  openTagsModal() {
    this.editTemplateTagsModal.show();
  }

  onTagsModalClosed() {}

  drop(event: CdkDragDrop<string[]>) {
    let exercises = this.template?.exercises!;
    moveItemInArray(exercises, event.previousIndex, event.currentIndex);
  }

  onDragEnded() {
    this.dragStarted = false;
  }

  addSet(exercise: Exercise) {
    let newSet: Sets = { reps: 0, weight: 0, completed: false };
    exercise.sets.push(newSet);

    if (this.template) {
      this.template.totalSets = this.template.totalSets + 1;
    }
  }

  deleteSet(set: Sets, index: number, exercise: Exercise) {
    this.setToDelete = set;
    this.deleteSetModeForExercise = exercise;
    this.deleteSetConfirmationModal.show(`Set #${index + 1} will be deleted`);

    if (this.template && this.template.totalSets > 0) {
      this.template.totalSets = this.template.totalSets - 1;
    }
  }

  onDeleteSetConfirmed(confirmed: boolean) {
    if (confirmed && this.deleteSetModeForExercise && this.setToDelete) {
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
    ];

    this.exerciseMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: 0,
    });
  }

  private removeExercise(exercise: Exercise) {
    this.exerciseToDelete = exercise;
    this.deleteExerciseConfirmationModal.show(
      'Exercise will be removed from the workout template',
    );
  }

  onDeleteExerciseConfirmed(confirmed: boolean) {
    if (confirmed && this.exerciseToDelete) {
      const index = this.template!.exercises!.indexOf(this.exerciseToDelete);
      if (index > -1) {
        this.template!.exercises!.splice(index, 1);
      }
    }
    this.exerciseToDelete = undefined;
  }

  private replaceExercise(exercise: Exercise) {
    this.exerciseToReplace = exercise;
    this.replaceExerciseConfirmationModal.show(
      'Exercise will be removed from the workout template and replaced with a new one',
    );
  }

  onReplaceExerciseConfirmed(confirmed: boolean) {
    if (confirmed && this.exerciseToReplace)
      this.exercisesModal.show(
        this.template?.exercises?.map((e) => e.id),
        false,
        true,
      );
  }

  onReplaceExerciseSelected(exercise: Exercise) {
    replaceItemInArray(
      this.template?.exercises!,
      exercise,
      (e) => e.id === this.exerciseToReplace.id,
    );
    this.exerciseToReplace = undefined;
  }

  addExercise() {
    this.exercisesModal.show(
      this.template?.exercises?.map((e) => e.id),
      true,
    );
  }

  onAddExercisesSelected(selectedExercises: Exercise[]) {
    if (selectedExercises.length > 0) {
      this.template?.exercises!.push(...selectedExercises);
    }
  }

  templateMenuItems = [
    {
      label: 'Reorder exercises',
      icon: 'swap',
      action: () => this.prepareExercisesViewForDrag(),
    },
    {
      label: 'Rename template',
      icon: 'text',
      action: () => this.makeTitleEditable(),
    },
    {
      label: 'Add exercise',
      icon: 'add-circle',
      action: () => this.addExercise(),
    },
  ];

  openTemplateMenu($event: MouseEvent) {
    this.workoutMenu.show({
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

  onSwipeRight() {
    this.close();
  }

  makeTitleEditable() {
    this.isTitleEditable = true;
  }

  makeTitleNonEditable() {
    if (this.templateTitle.length > 0) {
      this.isTitleEditable = false;
      if (this.template) {
        this.template.title = this.templateTitle;
      }
    }
  }
}
