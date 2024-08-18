import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { fadeInOut } from '../../../animations/fade-in-out';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';
import { HeaderButtonComponent } from '../header-button/header-button.component';
import { ExerciseService } from '../../../services/api/exercise-service';
import { Exercise } from '../../../models/exercise';
import { MatIcon } from '@angular/material/icon';
import { collapse } from '../../../animations/collapse';
import {
  BodyPart,
  Category,
} from '../../../services/api/dummy-data/exercises-dummy-data';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import {
  SelectionItem,
  SelectionMenuComponent,
} from '../selection-menu/selection-menu.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { collapseEnter } from '../../../animations/collapse-enter';

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
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
  animations: [fadeInOut, sideModalOpenClose, collapse, collapseEnter],
})
export class ExercisesComponent implements OnInit {
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
  protected itemsPerPage: number = 10; // increase later to 30 once backend added
  protected hasMoreItems: boolean = true;
  protected searchQuery: string = '';
  protected bodyPart: BodyPart | undefined = undefined;
  protected category: Category | undefined = undefined;

  @ViewChild('bodyPartSelectionMenu')
  bodyPartSelectionMenu!: SelectionMenuComponent;

  @ViewChild('categorySelectionMenu')
  categorySelectionMenu!: SelectionMenuComponent;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {}

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
        label: bodyPart.toString(),
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

    let allItem: SelectionItem<Category | null> = { label: 'All', value: null };
    let selectionItems: SelectionItem<Category | null>[] = [allItem];

    selectionItems.push(
      ...Object.values(Category).map((category) => ({
        label: category.toString(),
        value: category as Category,
      })),
    );

    this.categorySelectionMenu.show(position, selectionItems);
  }

  onCategoryItemSelected(selectionItem: SelectionItem<Category>) {
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
}
