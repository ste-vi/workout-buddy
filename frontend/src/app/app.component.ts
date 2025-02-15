import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { WorkoutHistoryDetailsComponent } from './components/workout-history-details/workout-history-details.component';
import 'keen-slider/keen-slider.min.css';
import { IosInstallPromptComponent } from './components/common/modal/ios-install-prompt/ios-install-prompt.component';
import { NetworkStatusComponent } from './components/common/network-status/network-status.component';
import { OngoingWorkoutComponent } from './components/ongoing-workout/ongoing-workout.component';
import { OngoingWorkoutService } from './services/communication/ongoing-workout.service';
import { Workout } from './models/workout';
import { CompletedWorkoutModalComponent } from './components/ongoing-workout/completed-workout-modal/completed-workout-modal.component';
import { AuthService } from './components/auth/auth-service';
import { filter } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UpdatePromptComponent } from './components/common/update-prompt/update-prompt.component';
import { ProcessService } from './services/api/process.service';
import { OnboardingService } from './services/communication/onboarding.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    WorkoutHistoryDetailsComponent,
    IosInstallPromptComponent,
    NetworkStatusComponent,
    OngoingWorkoutComponent,
    CompletedWorkoutModalComponent,
    UpdatePromptComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'workout-buddy';

  private iconsPath = '../assets/icons/svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private processService: ProcessService,
    private ongoingWorkoutService: OngoingWorkoutService,
    private authService: AuthService,
    private onboardingService: OnboardingService,
  ) {
    this.initSvgIcons();
  }

  ngOnInit() {
    this.authService.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        switchMap(() => this.processService.getOngoingProcess()),
      )
      .subscribe((process) => {
        if (process.workout) {
          this.ongoingWorkoutService.openModal(new Workout(process.workout));
        } else if (process.onboardingInProgress) {
          this.onboardingService.startOnboarding();
        }
      });
  }

  ngOnDestroy() {}

  private initSvgIcons() {
    this.matIconRegistry
      .addSvgIcon(
        'slider-vertical',
        this.setIconPath(`${this.iconsPath}/slider-vertical.svg`),
      )
      .addSvgIcon(
        'dumbbell-1',
        this.setIconPath(`${this.iconsPath}/dumbbell-1.svg`),
      )
      .addSvgIcon('text', this.setIconPath(`${this.iconsPath}/text.svg`))
      .addSvgIcon('history', this.setIconPath(`${this.iconsPath}/history.svg`))
      .addSvgIcon('medal', this.setIconPath(`${this.iconsPath}/medal.svg`))
      .addSvgIcon(
        'course-up',
        this.setIconPath(`${this.iconsPath}/course-up.svg`),
      )
      .addSvgIcon('clear', this.setIconPath(`${this.iconsPath}/clear.svg`))
      .addSvgIcon('danger', this.setIconPath(`${this.iconsPath}/danger.svg`))
      .addSvgIcon('warning', this.setIconPath(`${this.iconsPath}/warning.svg`))
      .addSvgIcon(
        'clipboard-remove',
        this.setIconPath(`${this.iconsPath}/clipboard-remove.svg`),
      )
      .addSvgIcon('library', this.setIconPath(`${this.iconsPath}/library.svg`))
      .addSvgIcon('login', this.setIconPath(`${this.iconsPath}/login.svg`))
      .addSvgIcon('logout', this.setIconPath(`${this.iconsPath}/logout.svg`))
      .addSvgIcon('email', this.setIconPath(`${this.iconsPath}/email.svg`))
      .addSvgIcon('scale', this.setIconPath(`${this.iconsPath}/scale.svg`))
      .addSvgIcon(
        'calendar',
        this.setIconPath(`${this.iconsPath}/calendar.svg`),
      )
      .addSvgIcon(
        'password',
        this.setIconPath(`${this.iconsPath}/password.svg`),
      )
      .addSvgIcon(
        'visibility',
        this.setIconPath(`${this.iconsPath}/visibility.svg`),
      )
      .addSvgIcon(
        'visibility-off',
        this.setIconPath(`${this.iconsPath}/visibility-off.svg`),
      )
      .addSvgIcon('google', this.setIconPath(`${this.iconsPath}/google.svg`))
      .addSvgIcon('options', this.setIconPath(`${this.iconsPath}/options.svg`))
      .addSvgIcon('edit', this.setIconPath(`${this.iconsPath}/edit.svg`))
      .addSvgIcon('search', this.setIconPath(`${this.iconsPath}/search.svg`))
      .addSvgIcon('undo', this.setIconPath(`${this.iconsPath}/undo.svg`))
      .addSvgIcon('swap', this.setIconPath(`${this.iconsPath}/swap.svg`))
      .addSvgIcon(
        'stopwatch',
        this.setIconPath(`${this.iconsPath}/stopwatch.svg`),
      )
      .addSvgIcon(
        'transfer',
        this.setIconPath(`${this.iconsPath}/transfer.svg`),
      )
      .addSvgIcon('delete', this.setIconPath(`${this.iconsPath}/delete.svg`))
      .addSvgIcon(
        'delete-2',
        this.setIconPath(`${this.iconsPath}/delete-2.svg`),
      )
      .addSvgIcon('check', this.setIconPath(`${this.iconsPath}/check.svg`))
      .addSvgIcon('finish', this.setIconPath(`${this.iconsPath}/finish.svg`))
      .addSvgIcon('close', this.setIconPath(`${this.iconsPath}/close.svg`))
      .addSvgIcon(
        'cup',
        this.setIconPath(`${this.iconsPath}/cup-svgrepo-com.svg`),
      )
      .addSvgIcon('clock', this.setIconPath(`${this.iconsPath}/clock.svg`))
      .addSvgIcon(
        'up-arrow',
        this.setIconPath(`${this.iconsPath}/up-arrow.svg`),
      )
      .addSvgIcon(
        'down-arrow',
        this.setIconPath(`${this.iconsPath}/down-arrow.svg`),
      )
      .addSvgIcon(
        'left-arrow',
        this.setIconPath(`${this.iconsPath}/left-arrow.svg`),
      )
      .addSvgIcon(
        'left-arrow-2',
        this.setIconPath(`${this.iconsPath}/left-arrow-2.svg`),
      )
      .addSvgIcon(
        'right-arrow',
        this.setIconPath(`${this.iconsPath}/right-arrow.svg`),
      )
      .addSvgIcon('list', this.setIconPath(`${this.iconsPath}/list.svg`))
      .addSvgIcon(
        'statistics',
        this.setIconPath(`${this.iconsPath}/statistics.svg`),
      )
      .addSvgIcon('persona', this.setIconPath(`${this.iconsPath}/persona.svg`))
      .addSvgIcon('user', this.setIconPath(`${this.iconsPath}/user.svg`))
      .addSvgIcon(
        'settings',
        this.setIconPath(`${this.iconsPath}/settings.svg`),
      )
      .addSvgIcon(
        'settings-2',
        this.setIconPath(`${this.iconsPath}/settings-2.svg`),
      )
      .addSvgIcon(
        'notification',
        this.setIconPath(`${this.iconsPath}/notification.svg`),
      )
      .addSvgIcon(
        'two-dots',
        this.setIconPath(`${this.iconsPath}/two-dots.svg`),
      )
      .addSvgIcon('home', this.setIconPath(`${this.iconsPath}/home.svg`))
      .addSvgIcon(
        'progress',
        this.setIconPath(`${this.iconsPath}/progress.svg`),
      )
      .addSvgIcon('camera', this.setIconPath(`${this.iconsPath}/camera.svg`))
      .addSvgIcon('profile', this.setIconPath(`${this.iconsPath}/profile.svg`))
      .addSvgIcon(
        'add',
        this.setIconPath(`${this.iconsPath}/add-svgrepo-com.svg`),
      )
      .addSvgIcon('inbox', this.setIconPath(`${this.iconsPath}/inbox.svg`))
      .addSvgIcon(
        'inbox-line',
        this.setIconPath(`${this.iconsPath}/inbox-line.svg`),
      )
      .addSvgIcon('archive', this.setIconPath(`${this.iconsPath}/archive.svg`))
      .addSvgIcon(
        'unarchive',
        this.setIconPath(`${this.iconsPath}/unarchive.svg`),
      )
      .addSvgIcon(
        'add-circle',
        this.setIconPath(`${this.iconsPath}/add-circle-svgrepo-com.svg`),
      );
  }

  private setIconPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
