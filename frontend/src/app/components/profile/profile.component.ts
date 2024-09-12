import { Component } from '@angular/core';
import {NavbarComponent} from "../common/navbar/navbar.component";
import {HeaderButtonComponent} from "../common/header-button/header-button.component";
import {ButtonComponent} from "../common/button/button.component";
import {MediumButtonComponent} from "../common/medium-button/medium-button.component";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NavbarComponent,
    HeaderButtonComponent,
    ButtonComponent,
    MediumButtonComponent,
    MatIcon,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  constructor(private router: Router) {}

  openWorkoutHistoryPage() {
    this.router.navigate(['/workout/history']).then((r) => {});
  }
}
