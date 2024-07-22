import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIcon, NgIf],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() color: string = 'primary-1';
  @Input() name: string = '';
  @Input() iconBefore: string | undefined = undefined;
  @Input() iconAfter: string | undefined = undefined;
}
