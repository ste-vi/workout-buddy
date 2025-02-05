import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-icon-input',
  templateUrl: './icon-input.component.html',
  styleUrls: ['./icon-input.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconInputComponent),
      multi: true,
    },
  ],
  imports: [MatIcon, NgIf, NgClass],
})
export class IconInputComponent implements ControlValueAccessor {
  @Input() leftIcon: string = '';
  @Input() rightIcon: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() autocomplete: string = 'off';
  @Input() disable: boolean = false;
  @Output() rightIconClick = new EventEmitter<void>();

  hasInput: boolean = false;

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.hasInput = input.value.trim().length > 0;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }

  onRightIconClick() {
    this.rightIconClick.emit();
  }
}
