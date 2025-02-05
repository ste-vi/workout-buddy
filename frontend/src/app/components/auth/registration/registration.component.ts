import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastComponent } from '../../common/toast/toast.component';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import { IconInputComponent } from '../../common/icon-input/icon-input.component';
import { ButtonComponent } from '../../common/button/button.component';
import { SocialButtonComponent } from '../../common/social-button/social-button.component';
import { fadeInOut } from '../../../animations/fade-in-out';
import { collapse } from '../../../animations/collapse';
import {OnboardingService} from "../../../services/communication/onboarding.service";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    IconInputComponent,
    ToastComponent,
    ButtonComponent,
    SocialButtonComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  animations: [collapse, fadeInOut],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isPasswordVisible: boolean = false;
  passwordInputType: string = 'password';
  passwordVisibilityIcon: string = 'visibility';
  isConfirmPasswordVisible: boolean = false;
  confirmPasswordInputType: string = 'password';
  confirmPasswordVisibilityIcon: string = 'visibility';
  isSubmitted = false;

  @ViewChild('errorToast')
  errorToast!: ToastComponent;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private onboardingService: OnboardingService
  ) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordInputType = this.isPasswordVisible ? 'text' : 'password';
    this.passwordVisibilityIcon = this.isPasswordVisible
      ? 'visibility-off'
      : 'visibility';
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    this.confirmPasswordInputType = this.isConfirmPasswordVisible
      ? 'text'
      : 'password';
    this.confirmPasswordVisibilityIcon = this.isConfirmPasswordVisible
      ? 'visibility-off'
      : 'visibility';
  }

  register() {
    this.isSubmitted = true;
    if (this.registrationForm.invalid) {
      return;
    }

    if (this.registrationForm.get('password')?.value !== this.registrationForm.get('confirmPassword')?.value) {
      this.registrationForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    this.authService
      .register(
        this.registrationForm.value.username,
        this.registrationForm.value.email,
        this.registrationForm.value.password,
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']).then();
          this.registrationForm.reset();
          this.onboardingService.startOnboarding();
        },
        error: (error) => {
          this.errorToast.open('Error', [error.toString()], 'danger');
        }
      });
  }

  googleSignUp() {}

  login() {
    this.router.navigate(['/login']).then();
  }
}
