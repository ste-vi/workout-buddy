import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForOf, NgIf, NgStyle } from '@angular/common';

export interface MenuItem {
  label: string;
  action: () => void;
}

export interface MenuPosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  standalone: true,
  styleUrls: ['./context-menu.component.scss'],
  imports: [NgStyle, NgForOf, NgIf],
})
export class ContextMenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() position: MenuPosition | undefined = undefined;

  @ViewChild('contextMenu') contextMenu!: ElementRef;

  x: number = 0;
  y: number = 0;
  isVisible = false;

  show(position: MenuPosition) {
    this.x = position.x;
    this.y = position.y - 40;

    setTimeout(() => {


      const menuWidth = this.contextMenu.nativeElement.offsetWidth;
      const menuHeight = this.contextMenu.nativeElement.offsetHeight;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if ( (windowWidth - this.x) < menuWidth ) {
        console.log('Right');
        this.x = windowWidth - menuWidth - 100;
      }

      if ( (windowHeight - this.y) < menuHeight ) {
        console.log('Top');
        this.y = windowHeight - menuHeight ;
      }
    }, 0);

    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  onMenuItemClick(item: MenuItem) {
    item.action();
    this.hide();
  }
}
