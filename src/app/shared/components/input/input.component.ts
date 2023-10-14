import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor {
  // props
  @Input() type: 'text' | 'number' = 'text';
  @Input() invalid: boolean = false;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() label: string = '';
  @Input() textError: string = '';

  // states
  currentValue: string | null | number = null;
  isDisabled: boolean = false;
  // methods
  onChangeCva = (_: any) => {};
  onTouchCva = () => {};

  onInputChange(e: Event) {
    const element = e.target as HTMLInputElement;
    this.currentValue = element.value;
    this.onTouchCva();
    this.onChangeCva(this.currentValue);
  }

  // lifecicle
  ngOnInit(): void {}

  registerOnChange(fn: any): void {
    this.onChangeCva = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchCva = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: any): void {
    if (
      typeof value === 'number' ||
      typeof value === 'string' ||
      value === null
    ) {
      this.currentValue = value;
    }
  }
}
