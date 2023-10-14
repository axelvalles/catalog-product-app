import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { TagInputComponent } from './components/tag-input/tag-input.component';

@NgModule({
  declarations: [InputComponent, TagInputComponent],
  imports: [CommonModule],
  exports: [InputComponent, TagInputComponent],
})
export class SharedModule {}
