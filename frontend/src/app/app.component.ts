import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './components/common/button/button.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {MatIconRegistry} from "@angular/material/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonComponent],
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
      .addSvgIcon('add', this.setIconPath(`${this.iconsPath}/add-svgrepo-com.svg`))
      .addSvgIcon('add-circle', this.setIconPath(`${this.iconsPath}/add-circle-svgrepo-com.svg`));
  }

  private setIconPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
