import { Component, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputValidationComponent } from '../input-validation/input-validation.component';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule, InputValidationComponent],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent {
  control = input.required<AbstractControl>();
  showErrorsWhen = input<boolean>(true);
  label = input<string>('');
  type = input<'text' | 'password' | 'email'>('text');

  get formControl() {
    return this.control() as FormControl;
  }
}
