import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { IconInputComponent } from '../../common/icon-input/icon-input.component';
import { ToastComponent } from '../../common/toast/toast.component';
import { ButtonComponent } from '../../common/button/button.component';
import { SocialButtonComponent } from '../../common/social-button/social-button.component';
import { collapse } from '../../../animations/collapse';
import {AuthService} from "../auth-service";
import {fadeInOut} from "../../../animations/fade-in-out";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonComponent,
    SocialButtonComponent,
    IconInputComponent,
    ReactiveFormsModule,
    NgIf,
    ToastComponent,
    IconInputComponent,
    ToastComponent,
    ButtonComponent,
    SocialButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [collapse, fadeInOut],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;
  passwordInputType: string = 'password';
  passwordVisibilityIcon: string = 'visibility';
  isSubmitted = false;

  @ViewChild('loginFormElement') loginFormElement!: ElementRef;

  @ViewChild('errorToast')
  errorToast!: ToastComponent;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordInputType = this.isPasswordVisible ? 'text' : 'password';
    this.passwordVisibilityIcon = this.isPasswordVisible
      ? 'visibility-off'
      : 'visibility';
  }

  login() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe((success) => {
          if (success) {
            this.router.navigate(['/dashboard']).then();
          } else {
            let errorMessage = 'Credentials are not correct';
            this.errorToast.open('Error', [errorMessage], 'danger');
          }
        });
    }
  }

  googleLogin() {}

  forgotPassword() {}

  register() {
    this.router.navigate(['/register']).then();
  }
}
