import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-admin-select',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-select.component.html',
  styleUrl: './admin-select.component.scss',
})
export class AdminSelectComponent {
  label = input<string>('');
  placeholder = input<string>('Select option');
  options = input<SelectOption[]>([]);
  control = input.required<FormControl>();
}
