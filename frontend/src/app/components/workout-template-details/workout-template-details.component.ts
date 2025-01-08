import {Component, OnInit, ViewChild} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { WorkoutTemplateDetailsService } from '../../services/communication/workout-template-details.service';
import { WorkoutTemplate } from '../../models/workout-template';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '../common/button/button.component';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { OngoingWorkoutComponent } from '../ongoing-workout/ongoing-workout.component';
import { sideModalOpenClose } from '../../animations/side-modal-open-close';
import { fadeInOut } from '../../animations/fade-in-out';
import {ContextMenuComponent} from "../common/context-menu/context-menu.component";
import {WorkoutTemplateEditComponent} from "../workout-template-edit/workout-template-edit.component";
import {getBodyPartDisplayName, getCategoryDisplayName} from "../../models/exercise";

@Component({
  selector: 'app-workout-template-details',
  standalone: true,
  imports: [
    NgIf,
    HeaderButtonComponent,
    MatIcon,
    ButtonComponent,
    NgForOf,
    TimeAgoPipe,
    OngoingWorkoutComponent,
    ContextMenuComponent,
    WorkoutTemplateEditComponent,
  ],
  templateUrl: './workout-template-details.component.html',
  styleUrl: './workout-template-details.component.scss',
  animations: [sideModalOpenClose, fadeInOut],
})
export class WorkoutTemplateDetailsComponent implements OnInit {
  protected isOpen: boolean = false;
  protected template: WorkoutTemplate | any = undefined;

  @ViewChild('workoutTemplateEditComponent')
  workoutTemplateEditComponent!: WorkoutTemplateEditComponent;

  @ViewChild('templateMenu') templateMenu!: ContextMenuComponent;

  constructor(
    private workoutTemplateDetailsService: WorkoutTemplateDetailsService,
    private ongoingWorkoutService: OngoingWorkoutService,
  ) {}

  ngOnInit(): void {
    this.workoutTemplateDetailsService.modalOpened$.subscribe((template) => {
      this.template = template;
      this.isOpen = true;
    });
  }

  closeModal() {
    this.isOpen = false;
  }

  onSwipeRight() {
    this.isOpen = false;
  }

  startWorkout() {
    this.ongoingWorkoutService.openModal(this.template);
    this.closeModal();
  }

  onTemplateUpdated(template: WorkoutTemplate) {

  }

  templateMenuItems: any = [];

  openTemplateMenu($event: MouseEvent): void {
    this.templateMenuItems = [
      {
        label: 'Edit template',
        icon: 'settings-2',
        action: () => this.openEdit(this.template),
      },
      {
        label: 'Delete template',
        icon: 'delete',
        action: () => this.openEdit(this.template),
      },
    ];

    this.templateMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: -30,
    });
  }

  openEdit(template: WorkoutTemplate) {
    this.workoutTemplateEditComponent.show(template);
  }

  protected readonly getBodyPartDisplayName = getBodyPartDisplayName;
  protected readonly getCategoryDisplayName = getCategoryDisplayName;
}
