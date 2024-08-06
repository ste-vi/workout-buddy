import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { MenuPosition } from '../../../models/menu-position';

export interface SelectionItem<T> {
  label: string;
  value: T | null;
}

@Component({
  selector: 'app-selection-menu',
  standalone: true,
  imports: [MatIcon, NgForOf, NgStyle, NgIf],
  templateUrl: './selection-menu.component.html',
  styleUrl: './selection-menu.component.scss',
})
export class SelectionMenuComponent {
  @Input() selectionItems: SelectionItem<any>[] = [];
  @Output() selectedItemSelected: EventEmitter<SelectionItem<any>> =
    new EventEmitter<SelectionItem<any>>();

  @ViewChild('selectionMenu') selectionMenu!: ElementRef;

  protected x: number = 0;
  protected y: number = 0;
  protected isVisible = false;
  protected opacity: number = 1.0;

  show(
    position: MenuPosition,
    overriddenSelectionItems?: SelectionItem<any>[],
  ) {
    this.x = position.x;
    this.y = position.y - 40;
    this.isVisible = true;
    this.opacity = 0.0;

    if (overriddenSelectionItems) {
      this.selectionItems = overriddenSelectionItems;
    }

    setTimeout(() => {
      if (this.selectionMenu && this.selectionMenu.nativeElement) {
        const menuWidth = this.selectionMenu.nativeElement.offsetWidth;
        const menuHeight = this.selectionMenu.nativeElement.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 30;

        // Adjust horizontal position
        if (position.x + menuWidth + margin > viewportWidth) {
          this.x = viewportWidth - menuWidth - position.xOffset - margin;
        } else {
          this.x = position.x - position.xOffset + margin;
        }

        // Adjust vertical position
        if (position.y + menuHeight + margin > viewportHeight) {
          this.y = viewportHeight - menuHeight - position.yOffset - margin;
        } else {
          this.y = position.y - 20 + margin;
        }
      }
      this.opacity = 1.0;
    }, 0);
  }

  hide() {
    setTimeout(() => {
      this.isVisible = false;
    }, 100);
  }

  select(item: SelectionItem<any>) {
    this.selectedItemSelected.emit(item);
    this.hide();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    try {
      if (
        this.isVisible &&
        !this.selectionMenu.nativeElement.contains(event.target)
      ) {
        this.hide();
      }
    } catch (ex) {
      // Do nothing. Means first time click event is fired view not ready
    }
  }
}
