import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-medium-button',
  standalone: true,
  imports: [MatIcon, NgIf, NgClass],
  templateUrl: './medium-button.component.html',
  styleUrl: './medium-button.component.scss',
})
export class MediumButtonComponent {
  @Input() classes: string[] = []
  @Input() textClasses: string[] = []
  @Input() name: string = '';
  @Input() iconBefore: string | undefined = undefined;
  @Input() iconAfter: string | undefined = undefined;
}
