import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private onboardingComplete = false;

  constructor(private router: Router) {}

  startOnboarding() {
    this.onboardingComplete = false;
    this.router.navigate(['/onboarding/personal-info']).then();
  }

  completePersonalInfo() {
    this.router.navigate(['/onboarding/success']).then();
  }

  finishOnboarding() {
    this.onboardingComplete = true;
    this.router.navigate(['/dashboard']).then();
  }

  isOnboardingComplete(): boolean {
    return this.onboardingComplete;
  }
}
