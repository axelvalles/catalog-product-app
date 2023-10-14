import { AbstractControl } from '@angular/forms';

export class MyValidators {
  static isValidUrl(control: AbstractControl) {
    try {
      new URL(control.value);
      return null;
    } catch (err) {
      return { invalidUrl: true };
    }
  }
}
