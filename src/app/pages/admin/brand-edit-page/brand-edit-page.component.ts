import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../entities/brand/api/brand.service';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-brand-edit-page',
  standalone: true,
  imports: [
    GrayLineComponent,
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
  ],
  templateUrl: './brand-edit-page.component.html',
  styleUrl: './brand-edit-page.component.scss',
})
export class BrandEditPageComponent implements OnInit {
  brandForm;
  isLoading = false;
  error: string | null = null;
  isSubmitted = false;
  brandId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private route: ActivatedRoute,
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

  ngOnInit() {
    this.brandId = this.route.snapshot.paramMap.get('id');
    if (this.brandId) {
      this.isLoading = true;
      this.brandService.getBrand(this.brandId).subscribe({
        next: (brand) => {
          this.brandForm.patchValue({ name: brand.name });
        },
        error: () => {
          this.error = 'Error loading brand';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  submit() {
    this.isSubmitted = true;
    if (this.brandForm.invalid || !this.brandId) return;
    this.isLoading = true;
    this.error = null;
    const dto = { name: this.brandForm.value.name || '' };
    this.brandService.updateBrand(this.brandId, dto).subscribe({
      next: () => this.router.navigate(['/admin/brands']),
      error: () => {
        this.error = 'Cannot update brand, maybe it already exists';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }

  cancel() {
    this.router.navigate(['/admin/brands']);
  }
}
