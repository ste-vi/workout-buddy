import { Component, ViewChild } from '@angular/core';
import { OnboardingService } from '../../../services/communication/onboarding.service';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';
import { ButtonComponent } from '../../common/button/button.component';
import { IconInputComponent } from '../../common/icon-input/icon-input.component';
import { NgIf } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastComponent } from '../../common/toast/toast.component';
import { MatIcon } from '@angular/material/icon';
import { collapse } from '../../../animations/collapse';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
  imports: [
    ButtonComponent,
    IconInputComponent,
    NgIf,
    ReactiveFormsModule,
    ToastComponent,
    MatIcon,
  ],
  animations: [sideModalOpenClose, collapse],
})
export class PersonalInfoComponent {
  isSubmitted = false;

  personalInfoForm: FormGroup;

  @ViewChild('genderSelectionMenu')
  errorToast!: ToastComponent;

  constructor(
    private onboardingService: OnboardingService,
    private fb: FormBuilder,
  ) {
    this.personalInfoForm = this.fb.group({
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, this.dateValidator]],
      height: [
        '',
        [Validators.required, Validators.min(30), Validators.max(250)],
      ],
      weight: [
        '',
        [Validators.required, Validators.min(30), Validators.max(250)],
      ],
    });
  }

  saveAndContinue() {
    this.isSubmitted = true;
    if (this.personalInfoForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formValues = this.personalInfoForm.value;
    const personalInfo = {
      gender: formValues.gender,
      dateOfBirth: formValues.dateOfBirth,
      height: formValues.height,
      weight: formValues.weight,
    };

    this.onboardingService.completePersonalInfo(personalInfo);
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const [day, month, year] = control.value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const currentYear = new Date().getFullYear();
      if (isNaN(date.getTime()) || year < 1950 || year > currentYear - 5) {
        return { invalidDate: true };
      }
    }
    return null;
  }
}
