import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent implements OnInit, ControlValueAccessor {
  // props
  @Input() type: 'text' | 'number' = 'text';
  @Input() invalid: boolean = false;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() label: string = '';
  @Input() textError: string = '';
  @Input() maxLength: number = 20;

  // states
  inputValue: string = '';
  currentValue: string[] = [];
  isDisabled: boolean = false;
  // methods
  onChangeCva = (_: any) => {};
  onTouchCva = () => {};

  onInputChange(e: Event) {
    const element = e.target as HTMLInputElement;
    this.inputValue = element.value;
  }

  onAddTag() {
    if (!this.inputValue || this.currentValue.length >= this.maxLength) {
      this.onTouchCva();
      return;
    }

    this.currentValue.push(this.inputValue);
    this.inputValue = '';
    this.onChangeCva(this.currentValue);
  }

  onDeleteTag(i: number) {
    if (this.isDisabled) return;
    this.currentValue.splice(i, 1);
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
    if (Array.isArray(value)) {
      this.currentValue = value;
    }
  }
}
