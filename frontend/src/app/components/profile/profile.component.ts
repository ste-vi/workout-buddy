import { Component, ViewChild } from '@angular/core';
import { HeaderButtonComponent } from '../common/header-button/header-button.component';
import { MediumButtonComponent } from '../common/medium-button/medium-button.component';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  ContextMenuComponent,
  MenuItem,
} from '../common/context-menu/context-menu.component';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderButtonComponent,
    MediumButtonComponent,
    MatIcon,
    ContextMenuComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  @ViewChild('profileMenu') profileMenu!: ContextMenuComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  openWorkoutHistoryPage() {
    this.router.navigate(['/workout/history']).then((r) => {});
  }

  profileMenuItems: MenuItem[] = [];

  openProfileMenu($event: MouseEvent) {
    this.profileMenuItems = [
      {
        label: 'Edit',
        icon: 'edit',
        action: () => {},
      },
      {
        label: 'Logout',
        icon: 'logout',
        action: () => this.logout(),
      },
    ];

    this.profileMenu.show({
      x: $event.clientX,
      y: $event.clientY,
      xOffset: 40,
      yOffset: 0,
    });
  }

  private logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {});
  }
}
