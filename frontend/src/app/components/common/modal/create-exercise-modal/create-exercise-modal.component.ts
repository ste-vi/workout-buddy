import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MediumButtonComponent } from '../../medium-button/medium-button.component';
import {
  BodyPart,
  Exercise,
  ExerciseCategory, getBodyPartDisplayName, getCategoryDisplayName,
} from '../../../../models/exercise';
import { dialogOpenClose } from '../../../../animations/dialog-open-close';
import { fadeInOut } from '../../../../animations/fade-in-out';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { collapse } from '../../../../animations/collapse';
import { ExerciseService } from '../../../../services/api/exercise-service';

@Component({
  selector: 'app-create-exercise-modal',
  standalone: true,
  imports: [
    NgIf,
    MediumButtonComponent,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.scss',
  animations: [dialogOpenClose, fadeInOut, collapse],
})
export class CreateExerciseModalComponent implements OnInit {
  protected isOpen: boolean = false;
  protected isEditMode: boolean = false;

  protected exerciseId: number | undefined = undefined;
  protected exerciseForm: FormGroup;
  protected categories: ExerciseCategory[] = [];
  protected bodyParts: BodyPart[] = [];

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
  ) {
    this.exerciseForm = this.fb.group({
      name: ['', Validators.required],
      bodyPart: [null, Validators.required],
      category: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.exerciseService
      .getBodyParts()
      .subscribe((bodyParts) => (this.bodyParts = bodyParts));
    this.exerciseService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  show(exercise?: Exercise): void {
    this.isOpen = true;
    if (exercise) {
      this.isEditMode = true;
      this.exerciseForm.patchValue(exercise);
      this.exerciseId = exercise.id;
    } else {
      this.isEditMode = false;
      this.exerciseForm.reset();
    }
  }

  close(): void {
    this.isOpen = false;
    this.exerciseForm.reset();
  }

  confirm(): void {
    if (this.exerciseForm.valid) {
      if (this.isEditMode) {
        this.exerciseService
          .updateExercise(
            this.exerciseId!,
            this.exerciseForm.value.name,
            this.exerciseForm.value.bodyPart,
            this.exerciseForm.value.category,
          )
          .subscribe(() => {
            this.close();
          });
      } else {
        this.exerciseService
          .createExercise(
            this.exerciseForm.value.name,
            this.exerciseForm.value.bodyPart,
            this.exerciseForm.value.category,
          )
          .subscribe(() => {
            this.close();
          });
      }
    } else {
      Object.values(this.exerciseForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }

  protected readonly getCategoryDisplayName = getCategoryDisplayName;
  protected readonly getBodyPartDisplayName = getBodyPartDisplayName;
}
