import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { dialogOpenClose } from '../../../../animations/dialog-open-close';
import { fadeInOut } from '../../../../animations/fade-in-out';
import { MediumButtonComponent } from '../../medium-button/medium-button.component';

@Component({
  selector: 'app-ios-install-prompt',
  standalone: true,
  imports: [NgIf, MediumButtonComponent],
  templateUrl: './ios-install-prompt.component.html',
  styleUrl: './ios-install-prompt.component.scss',
  animations: [dialogOpenClose, fadeInOut],
})
export class IosInstallPromptComponent implements OnInit {
  showPrompt = false;

  ngOnInit() {
    this.checkAndShowPrompt();
  }

  private checkAndShowPrompt() {
    const isIos = () =>
      /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    const hasPromptBeenShown =
      localStorage.getItem('iosPromptShown') === 'true';

    if (isIos() && !isInStandaloneMode() && !hasPromptBeenShown) {
      this.showPrompt = true;
    }
  }

  dismiss() {
    this.showPrompt = false;
    localStorage.setItem('iosPromptShown', 'true');
  }
}
