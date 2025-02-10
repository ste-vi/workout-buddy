import { Component } from '@angular/core';
import { OnboardingService } from '../../../services/communication/onboarding.service';
import {ButtonComponent} from "../../common/button/button.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-success',
  standalone: true,
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
  imports: [ButtonComponent, NgOptimizedImage],
})
export class SuccessComponent {
  constructor(private onboardingService: OnboardingService) {}

  finishOnboarding() {
    this.onboardingService.finishOnboarding();
  }
}
