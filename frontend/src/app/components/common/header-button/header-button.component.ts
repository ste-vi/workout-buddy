import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-header-button',
  standalone: true,
  imports: [MatIcon, NgIf, NgClass],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss',
})
export class HeaderButtonComponent {
  @Input() icon: string = '';
  @Input() text: string = '';
}
