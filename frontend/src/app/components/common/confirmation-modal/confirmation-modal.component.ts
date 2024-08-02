import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediumButtonComponent } from '../medium-button/medium-button.component';
import { NgIf } from '@angular/common';
import { openClose } from '../../../animations/open-close';
import { fadeInOut } from '../../../animations/fade-in-out';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [MediumButtonComponent, NgIf],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  animations: [openClose, fadeInOut],
})
export class ConfirmationModalComponent {
  @Input() header = 'Confirmation';
  @Input() message = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();

  protected isOpen: boolean = false;

  show(overrideHeader?: string) {
    if (overrideHeader) {
      this.header = overrideHeader;
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

  cancel() {
    this.confirmed.emit(false);
    this.hide();
  }
}
