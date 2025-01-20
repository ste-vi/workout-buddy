import { Component, OnInit, ViewChild } from '@angular/core';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import { MatIcon } from '@angular/material/icon';
import { WorkoutTemplateService } from '../../services/api/workout-template.service';
import { WorkoutTemplate } from '../../models/workout-template';
import { NgForOf, NgIf } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { WorkoutTemplateDetailsService } from '../../services/communication/workout-template-details.service';
import { OngoingWorkoutService } from '../../services/communication/ongoing-workout.service';
import { WorkoutTemplateDetailsComponent } from '../workout-template-details/workout-template-details.component';
import { WorkoutTemplateEditComponent } from '../workout-template-edit/workout-template-edit.component';
import { ContextMenuComponent } from '../common/context-menu/context-menu.component';
import { WorkoutTemplateWidgetComponent } from '../common/widgets/workout-template-widget/workout-template-widget.component';
import { fadeInOut } from '../../animations/fade-in-out';
import { WorkoutService } from '../../services/api/workout.service';

@Component({
  selector: 'app-start-workout',
  standalone: true,
  imports: [
    MediumButtonComponent,
    MatIcon,
    NgIf,
    TimeAgoPipe,
    NgForOf,
    WorkoutTemplateDetailsComponent,
    WorkoutTemplateEditComponent,
    ContextMenuComponent,
    WorkoutTemplateWidgetComponent,
  ],
  templateUrl: './start-workout.component.html',
  styleUrl: './start-workout.component.scss',
  animations: [fadeInOut],
})
export class StartWorkoutComponent implements OnInit {
  protected suggestedWorkoutTemplate: WorkoutTemplate | undefined = undefined;
  protected workoutTemplates: WorkoutTemplate[] = [];
  protected archivedWorkoutTemplates: WorkoutTemplate[] = [];

  protected showArchivedWorkouts: boolean = true;

  @ViewChild('workoutTemplateEditComponent')
  workoutTemplateEditComponent!: WorkoutTemplateEditComponent;

  @ViewChild('templateMenu') templateMenu!: ContextMenuComponent;

  constructor(
    private workoutTemplateService: WorkoutTemplateService,
    private workoutTemplateDetailsService: WorkoutTemplateDetailsService,
    private ongoingWorkoutService: OngoingWorkoutService,
    private workoutService: WorkoutService,
  ) {}

  ngOnInit(): void {
    this.workoutTemplateService
      .getSuggestedWorkoutTemplate()
      .subscribe((wt) => (this.suggestedWorkoutTemplate = wt));

    this.workoutTemplateService.getWorkoutTemplates().subscribe((array) => {
      this.workoutTemplates = array.filter((e) => !e.archived);
      this.archivedWorkoutTemplates = array.filter((e) => e.archived);
    });

    const showArchived = localStorage.getItem('showArchivedWorkouts');
    this.showArchivedWorkouts = showArchived ? JSON.parse(showArchived) : true;
  }

  openWorkoutTemplateDetails(workoutTemplate: WorkoutTemplate) {
    this.workoutTemplateDetailsService.openModal(workoutTemplate);
  }

  startWorkout(template: WorkoutTemplate) {
    this.workoutService.startWorkout(template.id!).subscribe((workout) => {
      this.ongoingWorkoutService.openModal(workout);
    });
  }

  createTemplate() {
    this.workoutTemplateEditComponent.show();
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
        label: template.archived ? 'Unarchive template' : 'Archive template',
        icon: template.archived ? 'unarchive' : 'archive',
        action: () =>
          template.archived
            ? this.unArchiveTemplate(template)
            : this.archiveTemplate(template),
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

  archiveTemplate(template: WorkoutTemplate) {
    this.workoutTemplateService
      .archiveWorkoutTemplate(template.id!)
      .subscribe(() => {
        template.archived = true;
        this.workoutTemplates = this.workoutTemplates.filter(
          (t) => t.id !== template.id,
        );
        this.archivedWorkoutTemplates.push(template);
      });
  }

  unArchiveTemplate(template: WorkoutTemplate) {
    this.workoutTemplateService
      .unarchiveWorkoutTemplate(template.id!)
      .subscribe(() => {
        template.archived = false;
        this.archivedWorkoutTemplates = this.archivedWorkoutTemplates.filter(
          (t) => t.id !== template.id,
        );
        this.workoutTemplates.push(template);
      });
  }

  toggleArchivedWorkouts(): void {
    this.showArchivedWorkouts = !this.showArchivedWorkouts;
    localStorage.setItem(
      'showArchivedWorkouts',
      JSON.stringify(this.showArchivedWorkouts),
    );
  }
}
