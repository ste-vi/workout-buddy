import { Component, EventEmitter, Output } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { MediumButtonComponent } from '../../medium-button/medium-button.component';
import { dialogOpenClose } from '../../../../animations/dialog-open-close';
import { fadeInOut } from '../../../../animations/fade-in-out';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyWeightMeasure } from '../../../../models/body-weight-measure';
import { DateTimePickerComponent } from '../../slider/date-time-picker/date-time-picker.component';
import { collapse } from '../../../../animations/collapse';
import { BodyWeightService } from '../../../../services/api/body-weight.service';

@Component({
  selector: 'app-update-weight-modal',
  standalone: true,
  imports: [
    NgIf,
    MediumButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    DateTimePickerComponent,
    DatePipe,
  ],
  templateUrl: './update-weight-modal.component.html',
  styleUrl: './update-weight-modal.component.scss',
  animations: [dialogOpenClose, fadeInOut, collapse],
})
export class UpdateWeightModalComponent {
  @Output() closeModal = new EventEmitter<BodyWeightMeasure>();

  protected isOpen: boolean = false;
  protected isEditMode: boolean = false;
  protected activeDatePicker: boolean = false;
  protected weight: number | undefined = undefined;
  protected lastWeight: number | undefined = 80;

  protected bodyWeightMeasure: BodyWeightMeasure | undefined = undefined;

  constructor(private bodyWeightService: BodyWeightService) {}

  show(measure?: BodyWeightMeasure, lastWeight?: number) {
    this.weight = undefined;
    this.lastWeight = lastWeight?? 70;
    if (measure !== undefined) {
      this.bodyWeightMeasure = measure;
      this.weight = measure.value;
      this.lastWeight = measure.value;
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.isOpen = true;
  }

  close() {
    this.closeModal.emit(undefined);
    this.isOpen = false;
  }

  confirm() {
    if (this.weight === undefined || this.weight < 40 || this.weight > 190) {
      return;
    }

    if (this.isEditMode) {
      this.bodyWeightMeasure!.value = this.weight;

      this.bodyWeightService
        .updateBodyWeight(this.bodyWeightMeasure!)
        .subscribe(() => {
          this.closeModal.next(this.bodyWeightMeasure!);
          this.isOpen = false;
        });
    } else {
      this.bodyWeightService
        .addBodyWeight(this.weight)
        .subscribe((bodyWeightMeasure: BodyWeightMeasure) => {
          this.closeModal.next(bodyWeightMeasure);
          this.isOpen = false;
        });
    }
  }

  onDateChange(date: Date) {
    this.bodyWeightMeasure!.date = date;
  }

  toggleDatePicker() {
    this.activeDatePicker = !this.activeDatePicker;
  }
}
