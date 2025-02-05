import { Component } from '@angular/core';
import { OnboardingService } from '../../../services/communication/onboarding.service';

@Component({
  selector: 'app-success',
  standalone: true,
  template: `
    <h2>Onboarding Complete!</h2>
    <p>You're all set to start your fitness journey.</p>
    <button (click)="finishOnboarding()">Go to Dashboard</button>
  `,
})
export class SuccessComponent {
  constructor(private onboardingService: OnboardingService) {}

  finishOnboarding() {
    this.onboardingService.finishOnboarding();
  }
}
