import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeService } from '../../../entities/type/api/type.service';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-type-create-page',
  standalone: true,
  imports: [GrayLineComponent, ReactiveFormsModule, TextInputComponent],
  templateUrl: './type-create-page.component.html',
  styleUrl: './type-create-page.component.scss',
})
export class TypeCreatePageComponent {
  typeForm;
  isSubmitted = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private typeService: TypeService,
    private router: Router
  ) {
    this.typeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  get fc() {
    return {
      name: this.typeForm.get('name')!,
    };
  }

  submit() {
    this.isSubmitted = true;
    if (this.typeForm.invalid) return;
    this.isLoading = true;
    this.error = null;
    const dto = { name: this.typeForm.value.name || '' };
    this.typeService.createType(dto).subscribe({
      next: () => this.router.navigate(['/admin/types']),
      error: () => {
        this.error = 'Cannot create type, maybe it already exists';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
