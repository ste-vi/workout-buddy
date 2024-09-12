import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { ButtonComponent } from '../common/button/button.component';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import { MatIcon } from '@angular/material/icon';
import { WorkoutTemplateService } from '../../services/api/workout-template.service';
import { WorkoutTemplate } from '../../models/workout-template';
import { NgForOf, NgIf } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { WorkoutTemplateDetailsService } from '../../services/communication/workout-template-details.service';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { OngoingWorkoutComponent } from '../ongoing-workout/ongoing-workout.component';
import { WorkoutTemplateDetailsComponent } from '../workout-template-details/workout-template-details.component';
import { WorkoutTemplateEditComponent } from '../workout-template-edit/workout-template-edit.component';
import { ContextMenuComponent } from '../common/context-menu/context-menu.component';
import {
  WorkoutTemplateWidgetComponent
} from "../common/widgets/workout-template-widget/workout-template-widget.component";

@Component({
  selector: 'app-start-workout',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    ButtonComponent,
    MediumButtonComponent,
    MatIcon,
    NgIf,
    TimeAgoPipe,
    NgForOf,
    OngoingWorkoutComponent,
    WorkoutTemplateDetailsComponent,
    WorkoutTemplateEditComponent,
    ContextMenuComponent,
    WorkoutTemplateWidgetComponent,
  ],
  templateUrl: './start-workout.component.html',
  styleUrl: './start-workout.component.scss',
})
export class StartWorkoutComponent implements OnInit {
  protected suggestedWorkoutTemplate: WorkoutTemplate | any = undefined;
  protected workoutTemplates: WorkoutTemplate[] = [];

  @ViewChild('workoutTemplateEditComponent')
  workoutTemplateEditComponent!: WorkoutTemplateEditComponent;

  @ViewChild('templateMenu') templateMenu!: ContextMenuComponent;

  constructor(
    private workoutTemplateService: WorkoutTemplateService,
    private workoutTemplateDetailsService: WorkoutTemplateDetailsService,
    private ongoingWorkoutService: OngoingWorkoutService,
  ) {}

  ngOnInit(): void {
    this.workoutTemplateService
      .getSuggestedWorkoutTemplate()
      .subscribe((wt) => (this.suggestedWorkoutTemplate = wt));

    this.workoutTemplateService
      .getWorkoutTemplates()
      .subscribe((array) => (this.workoutTemplates = array));
  }

  openWorkoutTemplateDetails(workoutTemplate: WorkoutTemplate) {
    this.workoutTemplateDetailsService.openModal(workoutTemplate);
  }

  startWorkout(template: WorkoutTemplate) {
    this.ongoingWorkoutService.openModal(template);
  }

  createTemplate() {
    this.workoutTemplateEditComponent.show();
  }

  onTemplateUpdated(updatedTemplate: WorkoutTemplate) {}

  onTemplateCreated(createdTemplate: WorkoutTemplate) {
    this.workoutTemplates.push(createdTemplate);
  }

  templateMenuItems: any = [];

  openTemplateMenu(template: WorkoutTemplate, $event: MouseEvent): void {
    this.templateMenuItems = [
      {
        label: 'Edit template',
        icon: 'settings-2',
        action: () => this.openEdit(template),
      },
      {
        label: 'Delete template',
        icon: 'delete',
        action: () => this.openEdit(template),
      },
    ];

    this.templateMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 70,
      yOffset: 0,
    });
  }

  openEdit(template: WorkoutTemplate) {
    this.workoutTemplateEditComponent.show(template);
  }
}
