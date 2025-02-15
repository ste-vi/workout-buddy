import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import {excludedRoutes} from "../../../app.routes";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIcon, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected currentPage: string = 'dashboard';
  protected isStandalone: boolean = false;
  protected showForPage: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.url;
        const path = currentUrl.split('/').pop();
        if (path) {
          this.currentPage = path;
          const isExcludedRoute = excludedRoutes.some((route) =>
            this.router.url.startsWith(route),
          );
          this.showForPage = !isExcludedRoute;
        }
      }
    });

    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  }

  navigateTo(path: string) {
    this.router.navigate([path]).then((r) => '');
  }
}
