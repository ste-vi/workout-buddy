import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [MatIcon, NgIf, NgClass],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent {
  @Input() icon!: string;
  @Input() iconClasses:
    | string
    | string[]
    | Set<string>
    | { [p: string]: any }
    | null
    | undefined;
}
