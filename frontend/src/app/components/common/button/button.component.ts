import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIcon, NgIf, NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() backgroundColor: string = 'primary-background';
  @Input() textClasses: string[] = []
  @Input() name: string = '';
  @Input() iconBefore: string | undefined = undefined;
  @Input() iconAfter: string | undefined = undefined;
}
