import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './components/common/button/button.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {NavbarComponent} from "./components/common/navbar/navbar.component";
import {WorkoutHistoryDetailsComponent} from "./components/workout-history-details/workout-history-details.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonComponent,
    DashboardComponent,
    NavbarComponent,
    WorkoutHistoryDetailsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'workout-buddy';

  private iconsPath = '../assets/icons/svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.initSvgIcons();
  }

  private initSvgIcons() {
    this.matIconRegistry
      .addSvgIcon('slider-vertical', this.setIconPath(`${this.iconsPath}/slider-vertical.svg`))
      .addSvgIcon('dumbbell-1', this.setIconPath(`${this.iconsPath}/dumbbell-1.svg`))
      .addSvgIcon('text', this.setIconPath(`${this.iconsPath}/text.svg`))
      .addSvgIcon('medal', this.setIconPath(`${this.iconsPath}/medal.svg`))
      .addSvgIcon('course-up', this.setIconPath(`${this.iconsPath}/course-up.svg`))
      .addSvgIcon('clear', this.setIconPath(`${this.iconsPath}/clear.svg`))
      .addSvgIcon('danger', this.setIconPath(`${this.iconsPath}/danger.svg`))
      .addSvgIcon('options', this.setIconPath(`${this.iconsPath}/options.svg`))
      .addSvgIcon('search', this.setIconPath(`${this.iconsPath}/search.svg`))
      .addSvgIcon('undo', this.setIconPath(`${this.iconsPath}/undo.svg`))
      .addSvgIcon('swap', this.setIconPath(`${this.iconsPath}/swap.svg`))
      .addSvgIcon('stopwatch', this.setIconPath(`${this.iconsPath}/stopwatch.svg`))
      .addSvgIcon('transfer', this.setIconPath(`${this.iconsPath}/transfer.svg`))
      .addSvgIcon('delete', this.setIconPath(`${this.iconsPath}/delete.svg`))
      .addSvgIcon('delete-2', this.setIconPath(`${this.iconsPath}/delete-2.svg`))
      .addSvgIcon('check', this.setIconPath(`${this.iconsPath}/check.svg`))
      .addSvgIcon('finish', this.setIconPath(`${this.iconsPath}/finish.svg`))
      .addSvgIcon('close', this.setIconPath(`${this.iconsPath}/close.svg`))
      .addSvgIcon('cup', this.setIconPath(`${this.iconsPath}/cup-svgrepo-com.svg`))
      .addSvgIcon('clock', this.setIconPath(`${this.iconsPath}/clock.svg`))
      .addSvgIcon('up-arrow', this.setIconPath(`${this.iconsPath}/up-arrow.svg`))
      .addSvgIcon('down-arrow', this.setIconPath(`${this.iconsPath}/down-arrow.svg`))
      .addSvgIcon('left-arrow', this.setIconPath(`${this.iconsPath}/left-arrow.svg`))
      .addSvgIcon('left-arrow-2', this.setIconPath(`${this.iconsPath}/left-arrow-2.svg`))
      .addSvgIcon('right-arrow', this.setIconPath(`${this.iconsPath}/right-arrow.svg`))
      .addSvgIcon('list', this.setIconPath(`${this.iconsPath}/list.svg`))
      .addSvgIcon('statistics', this.setIconPath(`${this.iconsPath}/statistics.svg`))
      .addSvgIcon('persona', this.setIconPath(`${this.iconsPath}/persona.svg`))
      .addSvgIcon('settings', this.setIconPath(`${this.iconsPath}/settings.svg`))
      .addSvgIcon('settings-2', this.setIconPath(`${this.iconsPath}/settings-2.svg`))
      .addSvgIcon('notification', this.setIconPath(`${this.iconsPath}/notification.svg`))
      .addSvgIcon('two-dots', this.setIconPath(`${this.iconsPath}/two-dots.svg`))
      .addSvgIcon('home', this.setIconPath(`${this.iconsPath}/home.svg`))
      .addSvgIcon('progress', this.setIconPath(`${this.iconsPath}/progress.svg`))
      .addSvgIcon('camera', this.setIconPath(`${this.iconsPath}/camera.svg`))
      .addSvgIcon('profile', this.setIconPath(`${this.iconsPath}/profile.svg`))
      .addSvgIcon('add', this.setIconPath(`${this.iconsPath}/add-svgrepo-com.svg`))
      .addSvgIcon('add-circle', this.setIconPath(`${this.iconsPath}/add-circle-svgrepo-com.svg`));
  }

  private setIconPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
