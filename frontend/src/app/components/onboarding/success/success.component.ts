import { Component } from '@angular/core';
import { OnboardingService } from '../../../services/communication/onboarding.service';
import { ButtonComponent } from '../../common/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';

@Component({
  selector: 'app-success',
  standalone: true,
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
  imports: [ButtonComponent, NgOptimizedImage],
  animations: [sideModalOpenClose],
})
export class SuccessComponent {
  constructor(private onboardingService: OnboardingService) {}

  finishOnboarding() {
    this.onboardingService.finishOnboarding();
  }
}
