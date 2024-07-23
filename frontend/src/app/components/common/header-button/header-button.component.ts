import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-header-button',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss',
})
export class HeaderButtonComponent {
  @Input() icon: string = 'left-arrow';
}
