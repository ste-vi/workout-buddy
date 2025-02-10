import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface OnboardingPersonalInfo {
  gender: string;
  dateOfBirth: string;
  height: number;
  weight: number;
}

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private onboardingDataSubject =
    new BehaviorSubject<OnboardingPersonalInfo | null>(null);

  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  startOnboarding() {
    this.router.navigate(['/onboarding/personal-info']).then();
  }

  completePersonalInfo(personalInfo: OnboardingPersonalInfo) {
    const currentData = this.onboardingDataSubject.getValue();
    if (currentData) {
      this.onboardingDataSubject.next(personalInfo);
    }
    this.router.navigate(['/onboarding/success']).then();
  }

  finishOnboarding() {
    const currentData = this.onboardingDataSubject.getValue();
    if (!currentData || !currentData) {
      console.error('No onboarding data available');
      return;
    }

    this.http
      .post(`${this.apiUrl}/users/onboarding/complete`, currentData)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']).then();
        },
        error: (error) => {
          console.error('Error completing onboarding:', error);
        },
        complete: () => {
          this.onboardingDataSubject.next(null);
        },
      });
  }
}
