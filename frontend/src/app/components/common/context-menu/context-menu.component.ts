import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MenuPosition } from '../../../models/menu-position';

export interface MenuItem {
  label: string;
  icon?: string;
  action: () => void;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  standalone: true,
  styleUrls: ['./context-menu.component.scss'],
  imports: [NgStyle, NgForOf, NgIf, MatIcon],
})
export class ContextMenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @ViewChild('contextMenu') contextMenu!: ElementRef;
  x: number = 0;
  y: number = 0;
  isVisible = false;
  opacity: number = 1.0;

  show(position: MenuPosition) {
    this.x = position.x;
    this.y = position.y - 40;
    this.isVisible = true;
    this.opacity = 0.0;

    setTimeout(() => {
      if (this.contextMenu && this.contextMenu.nativeElement) {
        this.x =
          position.x -
          this.contextMenu.nativeElement.offsetWidth -
          position.xOffset;
        this.y = position.y - 30 - position.yOffset;
      }
      this.opacity = 1.0;
    }, 0);
  }

  hide() {
    setTimeout(() => {
      this.isVisible = false;
    }, 100);
  }

  onMenuItemClick(item: MenuItem) {
    item.action();
    this.hide();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    try {
      if (
        this.isVisible &&
        !this.contextMenu.nativeElement.contains(event.target)
      ) {
        this.hide();
      }
    } catch (ex) {
      // Do nothing. Means first time click event is fired view not ready
    }
  }
}
