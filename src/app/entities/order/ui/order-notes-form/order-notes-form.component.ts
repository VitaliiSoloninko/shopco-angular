import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-notes-form',
  imports: [ReactiveFormsModule],
  templateUrl: './order-notes-form.component.html',
  styleUrl: './order-notes-form.component.scss',
  standalone: true,
})
export class OrderNotesFormComponent {
  notesForm: FormGroup;
  notesChange = output<string>();

  constructor(private fb: FormBuilder) {
    this.notesForm = this.fb.group({
      notes: [''],
    });

    this.notesForm.valueChanges.subscribe((value) => {
      this.notesChange.emit(value.notes || '');
    });
  }
}
