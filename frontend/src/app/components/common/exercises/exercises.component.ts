import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
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
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
  animations: [fadeInOut, sideModalOpenClose, collapse],
})
export class ExercisesComponent implements OnInit {
  protected isOpen: boolean = true;

  @Input() isAddModal: boolean = false;

  @Output() exercisesSelected: any = new EventEmitter<Exercise[]>();

  protected exercises: Exercise[] = [];

  protected excludeExercisesIds?: number[];

  protected isSearchOptionsOpen: boolean = false;
  protected currentPage: number = 0;
  protected itemsPerPage: number = 10;
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

  show(excludeExercisesIds?: number[]) {
    this.excludeExercisesIds = excludeExercisesIds;
    this.executeSearch();
    this.isOpen = true;
  }

  private executeSearch() {
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
        this.exercises = this.exercises.concat(pageResponse.content);
        this.hasMoreItems = !pageResponse.last;
      });
  }

  close() {
    this.isOpen = false;
    this.exercisesSelected.next([]);
  }

  search() {
    this.executeSearch();
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

    const selectionItems = Object.values(BodyPart).map((bodyPart) => ({
      label: bodyPart.toString(),
      value: bodyPart,
    }));

    this.bodyPartSelectionMenu.show(position, selectionItems);
  }

  onBodyPartItemSelected(selectionItem: SelectionItem<BodyPart>) {
    this.bodyPart = selectionItem.value;
    this.executeSearch();
  }

  openCategorySelectionModal($event: MouseEvent) {
    let position = {
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 0,
      yOffset: 0,
    };

    const selectionItems = Object.values(Category).map((category) => ({
      label: category.toString(),
      value: category,
    }));

    this.categorySelectionMenu.show(position, selectionItems);
  }

  onCategoryItemSelected(selectionItem: SelectionItem<Category>) {
    this.category = selectionItem.value;
    this.executeSearch();
  }

  addExercises() {
    this.isOpen = false;
    this.exercisesSelected.next([]);
  }
}
