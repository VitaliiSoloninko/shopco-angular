import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../entities/product/api/product.service';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import {
  ImageUploadComponent,
  ImageUploadError,
} from '../../../shared/ui/image-upload/image-upload.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-product-image-upload-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GrayLineComponent,
    ImageUploadComponent,
    LoaderComponent,
  ],
  templateUrl: './product-image-upload-page.component.html',
  styleUrl: './product-image-upload-page.component.scss',
})
export class ProductImageUploadPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private productService = inject(ProductService);

  uploadForm = this.fb.group({
    image: [null as File | null, [Validators.required]],
  });

  isSubmitted = false;
  loading = false;
  uploadError: ImageUploadError | null = null;
  productId: string | null = null;

  ngOnInit() {
    // Get product ID from URL
    this.productId = this.route.snapshot.paramMap.get('id');
    if (!this.productId) {
      // If no ID, redirect to products page
      this.router.navigate(['/admin/products']);
    }
  }

  onImageSelected(file: File | null): void {
    this.uploadError = null;
    this.uploadForm.patchValue({ image: file });
  }

  onImageError(error: ImageUploadError | null): void {
    this.uploadError = error;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.uploadForm.valid && this.productId) {
      const imageFile = this.uploadForm.value.image;

      if (imageFile) {
        this.loading = true;

        this.productService
          .uploadProductImage(parseInt(this.productId), imageFile)
          .subscribe({
            next: (response) => {
              console.log('Image uploaded successfully:', response);
              // Redirect back to products page
              this.router.navigate(['/admin/products']);
            },
            error: (error) => {
              console.error('Error uploading image:', error);
              this.uploadError = {
                type: 'upload',
                message: 'Failed to upload image. Please try again.',
              };
              this.loading = false;
            },
          });
      }
    }
  }

  get fc() {
    return {
      image: this.uploadForm.get('image')! as FormControl,
    };
  }
}
