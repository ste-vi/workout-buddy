import {Component, OnInit} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { MediumButtonComponent } from '../../medium-button/medium-button.component';
import { BodyPart, Category, Exercise } from '../../../../models/exercise';
import { dialogOpenClose } from '../../../../animations/dialog-open-close';
import { fadeInOut } from '../../../../animations/fade-in-out';
import {
  FormBuilder,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-exercise-modal',
  standalone: true,
  imports: [
    NgIf,
    MediumButtonComponent,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
  ],
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.scss',
  animations: [dialogOpenClose, fadeInOut],
})
export class CreateExerciseModalComponent implements OnInit {
  protected isOpen: boolean = false;
  protected isEditMode: boolean = false;

  exerciseForm: FormGroup;
  categories: Category[] = Object.values(Category);
  bodyParts: BodyPart[] = Object.values(BodyPart);

  constructor(private fb: FormBuilder) {
    this.exerciseForm = this.fb.group({
      name: ['', Validators.required],
      bodyPart: [null, Validators.required],
      category: [null, Validators.required],
    });
  }

  ngOnInit() {
  }

  show(exercise?: Exercise): void {
    this.isOpen = true;
    if (exercise) {
      this.isEditMode = true;
      this.exerciseForm.patchValue(exercise);
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
      console.log(this.exerciseForm.value);
      this.close();
    } else {
      Object.values(this.exerciseForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
}
