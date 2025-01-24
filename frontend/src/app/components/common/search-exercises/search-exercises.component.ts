import {
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { fadeInOut } from '../../../animations/fade-in-out';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';
import { HeaderButtonComponent } from '../header-button/header-button.component';
import { ExerciseService } from '../../../services/api/exercise-service';
import {
  BodyPart,
  ExerciseCategory,
  Exercise,
  getBodyPartDisplayName,
  getCategoryDisplayName,
} from '../../../models/exercise';
import { MatIcon } from '@angular/material/icon';
import { collapse } from '../../../animations/collapse';

import { ContextMenuComponent } from '../context-menu/context-menu.component';
import {
  SelectionItem,
  SelectionMenuComponent,
} from '../selection-menu/selection-menu.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { collapseEnter } from '../../../animations/collapse-enter';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { CreateExerciseModalComponent } from '../modal/create-exercise-modal/create-exercise-modal.component';
import { ActionButtonComponent } from '../action-button/action-button.component';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    NgIf,
    HeaderButtonComponent,
    MatIcon,
    ContextMenuComponent,
    SelectionMenuComponent,
    NgForOf,
    NgClass,
    InfiniteScrollDirective,
    FormsModule,
    ConfirmationModalComponent,
    CreateExerciseModalComponent,
    ActionButtonComponent,
  ],
  templateUrl: './search-exercises.component.html',
  styleUrl: './search-exercises.component.scss',
  animations: [fadeInOut, sideModalOpenClose, collapse, collapseEnter],
})
export class SearchExercisesComponent implements OnInit, OnDestroy {
  protected isOpen: boolean = false;

  protected isAddModal: boolean = false;
  protected isReplaceModal: boolean = false;

  @Output() exercisesSelected: any = new EventEmitter<Exercise[]>();
  @Output() exerciseReplaceSelected: any = new EventEmitter<Exercise>();

  protected selectedExercises: Set<Exercise> = new Set();

  protected exercises: Exercise[] = [];

  protected excludeExercisesIds?: number[];

  protected isSearchOptionsOpen: boolean = false;
  protected currentPage: number = 0;
  protected itemsPerPage: number = 30;
  protected hasMoreItems: boolean = true;
  protected searchQuery: string = '';
  protected bodyPart: BodyPart | undefined = undefined;
  protected category: ExerciseCategory | undefined = undefined;

  private exerciseToDelete: Exercise | undefined = undefined;

  private subscriptions: Subscription[] = [];

  @ViewChild('bodyPartSelectionMenu')
  bodyPartSelectionMenu!: SelectionMenuComponent;

  @ViewChild('categorySelectionMenu')
  categorySelectionMenu!: SelectionMenuComponent;

  @ViewChild('exerciseMenu')
  exerciseMenu!: ContextMenuComponent;

  @ViewChild('deleteExerciseConfirmationModal')
  deleteExerciseConfirmationModal!: ConfirmationModalComponent;

  @ViewChild('createExerciseModal')
  createExerciseModal!: CreateExerciseModalComponent;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    let subscription = this.exerciseService.dataChanged$.subscribe(() => {
      this.loadExercises(true);
    });
    this.subscriptions.push(subscription);
  }

  show(
    excludeExercisesIds?: number[],
    isAddModal?: boolean,
    isReplaceModal?: boolean,
  ) {
    this.excludeExercisesIds = excludeExercisesIds;
    this.isAddModal = isAddModal ?? false;
    this.isReplaceModal = isReplaceModal ?? false;

    this.searchQuery = '';
    this.currentPage = 0;
    this.exercises = [];

    this.loadExercises();

    this.isOpen = true;
  }

  private loadExercises(isSearch: boolean = false) {
    if (isSearch) {
      this.exercises = [];
      this.currentPage = 0;
    }

    this.exerciseService
      .searchExercises(
        this.currentPage,
        this.itemsPerPage,
        this.searchQuery,
        this.bodyPart,
        this.category,
        this.excludeExercisesIds,
      )
      .subscribe((pageResponse) => {
        this.exercises = isSearch
          ? pageResponse.content
          : this.exercises.concat(pageResponse.content);

        this.hasMoreItems = !pageResponse.last;
      });
  }

  loadMore() {
    if (this.hasMoreItems) {
      this.currentPage++;
      this.loadExercises();
    }
  }

  close() {
    this.isOpen = false;
    this.exercisesSelected.next([]);
  }

  search() {
    this.loadExercises(true);
  }

  onSwipeRight() {
    this.close();
  }

  openSearchOptions() {
    this.isSearchOptionsOpen = !this.isSearchOptionsOpen;
  }

  clearSearch() {
    this.searchQuery = '';
    this.bodyPart = undefined;
    this.category = undefined;
    this.loadExercises(true);
  }

  openBodyPartSelectionModal($event: MouseEvent) {
    let position = {
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 50,
      yOffset: 0,
    };

    let allItem: SelectionItem<BodyPart | null> = { label: 'All', value: null };
    let selectionItems: SelectionItem<BodyPart | null>[] = [allItem];

    selectionItems.push(
      ...Object.values(BodyPart).map((bodyPart) => ({
        label: getBodyPartDisplayName(bodyPart),
        value: bodyPart as BodyPart,
      })),
    );

    this.bodyPartSelectionMenu.show(position, selectionItems);
  }

  onBodyPartItemSelected(selectionItem: SelectionItem<BodyPart>) {
    if (selectionItem.value) {
      this.bodyPart = selectionItem.value;
    } else {
      this.bodyPart = undefined;
    }
    this.loadExercises(true);
  }

  openCategorySelectionModal($event: MouseEvent) {
    let position = {
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 0,
      yOffset: 0,
    };

    let allItem: SelectionItem<ExerciseCategory | null> = {
      label: 'All',
      value: null,
    };
    let selectionItems: SelectionItem<ExerciseCategory | null>[] = [allItem];

    selectionItems.push(
      ...Object.values(ExerciseCategory).map((category) => ({
        label: getCategoryDisplayName(category),
        value: category as ExerciseCategory,
      })),
    );

    this.categorySelectionMenu.show(position, selectionItems);
  }

  onCategoryItemSelected(selectionItem: SelectionItem<ExerciseCategory>) {
    if (selectionItem.value) {
      this.category = selectionItem.value;
    } else {
      this.category = undefined;
    }
    this.loadExercises(true);
  }

  addExercise(exercise: Exercise) {
    if (this.selectedExercises.has(exercise)) {
      this.selectedExercises.delete(exercise);
    } else {
      this.selectedExercises.add(exercise);
    }
  }

  addExercises() {
    if (this.selectedExercises.size > 0) {
      this.isOpen = false;
      this.exercisesSelected.emit(Array.from(this.selectedExercises));
      this.selectedExercises.clear();
    }
  }

  replaceExercise(exercise: Exercise) {
    this.selectedExercises.clear();
    this.selectedExercises.add(exercise);
  }

  replaceExercises() {
    if (this.selectedExercises.size == 1) {
      this.isOpen = false;
      let exercise = this.selectedExercises.values().next().value;
      this.exerciseReplaceSelected.emit(exercise);
      this.selectedExercises.clear();
    }
  }

  exerciseMenuItems: any = [];

  showExercisesMenu($event: MouseEvent, exercise: Exercise) {
    this.exerciseMenuItems = [
      {
        label: 'Edit exercise',
        icon: 'edit',
        action: () => this.openEditExerciseModal(exercise),
      },
      {
        label: 'Delete exercise',
        icon: 'delete',
        action: () => this.deleteExercise(exercise),
      },
    ];
    this.exerciseMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: 0,
    });
  }

  protected openAddExerciseModal() {
    this.createExerciseModal.show();
  }

  private openEditExerciseModal(exercise: Exercise) {
    this.createExerciseModal.show(exercise);
  }

  deleteExercise(exercise: Exercise) {
    this.deleteExerciseConfirmationModal.show(
      `Exercise "${exercise.name}" will be deleted. This operation cannot be undone.`,
    );
    this.exerciseToDelete = exercise;
  }

  onDeleteExerciseConfirmed(confirmed: boolean) {
    if (confirmed && this.exercises && this.exerciseToDelete) {
      this.exerciseService
        .deleteExercise(this.exerciseToDelete!.id!)
        .subscribe(() => {
          const index = this.exercises!.indexOf(this.exerciseToDelete!);
          if (index > -1) {
            this.exercises!.splice(index, 1);
          }
        });
    }
    this.exerciseToDelete = undefined;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  protected readonly getBodyPartDisplayName = getBodyPartDisplayName;
  protected readonly getCategoryDisplayName = getCategoryDisplayName;
}
