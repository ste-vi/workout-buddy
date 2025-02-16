import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IconInputComponent } from '../../common/icon-input/icon-input.component';
import { ToastComponent } from '../../common/toast/toast.component';
import { ButtonComponent } from '../../common/button/button.component';
import { SocialButtonComponent } from '../../common/social-button/social-button.component';
import { collapse } from '../../../animations/collapse';
import { AuthService } from '../auth-service';
import { fadeInOut } from '../../../animations/fade-in-out';

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

  @ViewChild('errorToast')
  errorToast!: ToastComponent;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.handleOauth();
  }

  private handleOauth() {
    this.authService.removeAuthorization();
    const accessToken = this.activatedRoute.snapshot.queryParams['accessToken'];
    if (accessToken) {
      this.authService.authorize(accessToken);
      this.router.navigate(['/']).then((r) => '');
    }
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordInputType = this.isPasswordVisible ? 'text' : 'password';
    this.passwordVisibilityIcon = this.isPasswordVisible
      ? 'visibility-off'
      : 'visibility';
  }

  googleLogin() {
    this.authService.loginViaGoogle();
  }

  login() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.authService
        .loginWithCredentials(
          this.loginForm.value.email,
          this.loginForm.value.password,
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']).then();
          },
          error: (error) => {
            console.log(error);
            this.errorToast.open(
              'Error',
              [error.message?.toString()],
              'danger',
            );
          },
        });
    }
  }

  forgotPassword() {}

  register() {
    this.router.navigate(['/register']).then();
  }
}
