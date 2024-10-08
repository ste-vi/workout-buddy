import { Component, ViewChild } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { WorkoutHistoryDetailsService } from '../../services/communication/workout-history-details.service';
import { WorkoutHistory } from '../../models/workout-history';
import { ContextMenuComponent } from '../common/context-menu/context-menu.component';
import { sideModalOpenClose } from '../../animations/side-modal-open-close';
import { fadeInOut } from '../../animations/fade-in-out';
import { suggestedWorkoutTemplate } from '../../services/api/dummy-data/workflow-templates-dummy-daya';
import {FormsModule} from "@angular/forms";
import {ActionButtonComponent} from "../common/action-button/action-button.component";
import {TagsModalComponent} from "../common/tags-modal/tags-modal.component";
import {TimeAgoPipe} from "../../pipes/time-ago-pipe";
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {MatIcon} from "@angular/material/icon";

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
    TimeAgoPipe,
    CdkDrag,
    CdkDragHandle,
    MatIcon,
    NgClass,
    CdkDropList,
  ],
  templateUrl: './workout-history-details.component.html',
  styleUrl: './workout-history-details.component.scss',
  animations: [fadeInOut, sideModalOpenClose],
})
export class WorkoutHistoryDetailsComponent {
  protected isOpen: boolean = false;
  protected workoutHistory!: WorkoutHistory;
  protected isEditView: boolean = false;

  @ViewChild('workoutMenu') workoutMenu!: ContextMenuComponent;

  constructor(
    private workoutHistoryDetailsService: WorkoutHistoryDetailsService,
  ) {
    this.workoutHistoryDetailsService.modalOpened$.subscribe((wh) => {
      this.workoutHistory = wh;
      this.isOpen = true;
      this.isEditView = false;
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

  workoutMenuItems: any = [];

  openWorkoutMenu($event: MouseEvent): void {
    this.workoutMenuItems = [
      {
        label: 'Edit workout',
        icon: 'settings-2',
        action: () => this.openEdit(this.workoutHistory),
      },
      {
        label: 'Delete template',
        icon: 'delete',
        action: () => this.deleteWorkout(this.workoutHistory),
      },
    ];

    this.workoutMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: -30,
    });
  }

  private deleteWorkout(workoutHistory: WorkoutHistory) {}

  private openEdit(workoutHistory: WorkoutHistory) {
    this.switchView();
  }

  save() {
    this.switchView();
  }

}
