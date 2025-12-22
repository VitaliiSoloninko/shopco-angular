import { Component, effect, input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextInputComponent } from '../../../../shared/ui/inputs/text-input/text-input.component';
import { UserName } from '../../model/user-name';

@Component({
  selector: 'app-user-name-form',
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './user-name-form.component.html',
  styleUrl: './user-name-form.component.scss',
})
export class UserNameFormComponent {
  userNameForm: FormGroup;
  userNameChange = output<UserName>();

  // Input for initial values
  initialValue = input<UserName | null>(null);

  constructor(private fb: FormBuilder) {
    this.userNameForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.userNameForm.valueChanges.subscribe((value: UserName) => {
      this.userNameChange.emit(value);
    });

    // Autofill the form when initial values are received
    effect(() => {
      const initial = this.initialValue();
      if (initial) {
        this.userNameForm.patchValue(initial, { emitEvent: false });
        // Emit initial value
        this.userNameChange.emit(initial);
      }
    });
  }
}
