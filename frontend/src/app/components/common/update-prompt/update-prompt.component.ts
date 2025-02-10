import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MediumButtonComponent } from '../medium-button/medium-button.component';
import { fadeInOut } from '../../../animations/fade-in-out';
import { dialogOpenClose } from '../../../animations/dialog-open-close';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-update-prompt',
  standalone: true,
  imports: [NgIf, MatIconModule, MediumButtonComponent],
  templateUrl: './update-prompt.component.html',
  styleUrls: ['./update-prompt.component.scss'],
  animations: [fadeInOut, dialogOpenClose],
})
export class UpdatePromptComponent implements OnInit {
  showUpdatePrompt = false;

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    this.checkForUpdates();
  }

  private checkForUpdates() {
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      )
      .subscribe(() => {
        this.showUpdatePrompt = true;
      });
  }

  reloadApp() {
    this.swUpdate.activateUpdate().then(() => window.location.reload());
  }
}
