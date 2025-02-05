import { Component, ViewChild } from '@angular/core';
import { OnboardingService } from '../../../services/communication/onboarding.service';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';
import { ButtonComponent } from '../../common/button/button.component';
import { IconInputComponent } from '../../common/icon-input/icon-input.component';
import { NgIf } from '@angular/common';
import {
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
      dateOfBirth: ['', [Validators.required]],
      height: [
        '',
        [Validators.required, Validators.min(30), Validators.max(250)],
      ],
      weight: [
        '',
        [Validators.required],
        Validators.min(30),
        Validators.max(250),
      ],
    });
  }

  saveAndContinue() {
    this.isSubmitted = true;
    if (this.personalInfoForm.invalid) {
      return;
    }

    this.onboardingService.completePersonalInfo();
  }
}
