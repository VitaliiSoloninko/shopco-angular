import { Component, effect, input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextInputComponent } from '../../../../shared/ui/inputs/text-input/text-input.component';
import { UserAddress } from '../../model/user-address';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  addressForm: FormGroup;
  addressChange = output<UserAddress>();

  // Input for initial values
  initialValue = input<UserAddress | null>(null);

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
    });

    this.addressForm.valueChanges.subscribe((value: UserAddress) => {
      this.addressChange.emit(value);
    });

    // Autofill the form when initial values are received
    effect(() => {
      const initial = this.initialValue();
      if (initial) {
        this.addressForm.patchValue(initial, { emitEvent: false });
        // Emit initial value
        this.addressChange.emit(initial);
      }
    });
  }
}
