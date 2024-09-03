import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { toast } from '../../../animations/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatIcon, NgIf, NgForOf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [toast],
})
export class ToastComponent {
  protected isOpen: boolean = false;
  protected icon: string | undefined = '';
  protected header: string = 'Notification';
  protected items: string[] = [];

  open(header: string, items: string[], icon?: string): void {
    this.isOpen = true;
    this.header = header;
    this.items = items;
    this.icon = icon;
  }

  close(): void {
    this.isOpen = false;
    this.items = [];
  }
}
