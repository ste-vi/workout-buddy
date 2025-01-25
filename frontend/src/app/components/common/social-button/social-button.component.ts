import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-social-button',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './social-button.component.html',
  styleUrl: './social-button.component.scss',
})
export class SocialButtonComponent {
  @Input() icon: string = '';
}
