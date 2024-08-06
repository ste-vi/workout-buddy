import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIcon, NgIf, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected currentPage: string = 'dashboard';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.url;
        const path = currentUrl.split('/').pop();
        if (path) {
          this.currentPage = path;
        }
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]).then((r) => '');
  }
}
