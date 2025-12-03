import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../../entities/brand/api/brand.service';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-brand-create-page',
  standalone: true,
  imports: [GrayLineComponent, ReactiveFormsModule, TextInputComponent],
  templateUrl: './brand-create-page.component.html',
  styleUrl: './brand-create-page.component.scss',
})
export class BrandCreatePageComponent {
  brandForm;
  isSubmitted = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router
  ) {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  get fc() {
    return {
      name: this.brandForm.get('name')!,
    };
  }

  submit() {
    this.isSubmitted = true;
    if (this.brandForm.invalid) return;
    this.isLoading = true;
    this.error = null;
    const dto = { name: this.brandForm.value.name || '' };
    this.brandService.createBrand(dto).subscribe({
      next: () => this.router.navigate(['/admin/brands']),
      error: () => {
        this.error = 'Cannot create brand, maybe it already exists';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }

  cancel() {
    this.router.navigate(['/admin/brands']);
  }
}
