import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import {MediumButtonComponent} from "../../medium-button/medium-button.component";
import {dialogOpenClose} from "../../../../animations/dialog-open-close";
import {fadeInOut} from "../../../../animations/fade-in-out";

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [MediumButtonComponent, NgIf],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  animations: [dialogOpenClose, fadeInOut],
})
export class ConfirmationModalComponent {
  @Input() header = 'Confirmation';
  @Input() message = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();

  protected isOpen: boolean = false;

  show(overrideMessage?: string) {
    if (overrideMessage) {
      this.message = overrideMessage;
    }
    this.isOpen = true;
  }

  hide() {
    this.isOpen = false;
  }

  confirm() {
    this.confirmed.emit(true);
    this.hide();
  }

  close() {
    this.confirmed.emit(false);
    this.hide();
  }
}
