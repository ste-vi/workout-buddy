import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  private excludedRoutes = ['/login', '/register'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAndShowPrompt();
      });
  }

  private checkAndShowPrompt() {
    const isIos = /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase(),
    );
    const isInStandaloneMode =
      'standalone' in window.navigator &&
      (window.navigator as any)['standalone'];
    const hasPromptBeenShown =
      localStorage.getItem('iosPromptShown') === 'true';
    const isExcludedRoute = this.excludedRoutes.some((route) =>
      this.router.url.startsWith(route),
    );

    setTimeout(() => {
      this.showPrompt =
        isIos && !isInStandaloneMode && !hasPromptBeenShown && !isExcludedRoute;
    }, 5000);
  }

  dismiss() {
    this.showPrompt = false;
    localStorage.setItem('iosPromptShown', 'true');
  }
}
