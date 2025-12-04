import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../../entities/brand/api/brand.service';
import { Brand } from '../../../entities/brand/model/brand';
import { ProductService } from '../../../entities/product/api/product.service';
import { ProductCreateDto } from '../../../entities/product/model/product';
import { TypeService } from '../../../entities/type/api/type.service';
import { Type } from '../../../entities/type/model/type';
import { AdminSelectComponent } from '../../../shared/ui/admin-select/admin-select.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { ImageUploadComponent } from '../../../shared/ui/image-upload/image-upload.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-product-create-page',
  standalone: true,
  imports: [
    CommonModule,
    GrayLineComponent,
    ReactiveFormsModule,
    TextInputComponent,
    AdminSelectComponent,
    ImageUploadComponent,
  ],
  templateUrl: './product-create-page.component.html',
  styleUrl: './product-create-page.component.scss',
})
export class ProductCreatePageComponent implements OnInit {
  productForm;
  isSubmitted = false;
  isLoading = false;
  error: string | null = null;
  types: Type[] = [];
  brands: Brand[] = [];
  typeOptions: SelectOption[] = [];
  brandOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private typeService: TypeService,
    private brandService: BrandService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      img: [null], // Убираем Validators.required - поле img теперь необязательное
      oldPrice: [''],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      typeId: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
    });
  }

  get fc() {
    return {
      name: this.productForm.get('name')! as FormControl,
      price: this.productForm.get('price')! as FormControl,
      rating: this.productForm.get('rating')! as FormControl,
      img: this.productForm.get('img')! as FormControl,
      oldPrice: this.productForm.get('oldPrice')! as FormControl,
      discount: this.productForm.get('discount')! as FormControl,
      typeId: this.productForm.get('typeId')! as FormControl,
      brandId: this.productForm.get('brandId')! as FormControl,
    };
  }

  ngOnInit() {
    this.loadTypes();
    this.loadBrands();
  }

  loadTypes() {
    this.typeService.getTypes().subscribe({
      next: (types) => {
        this.types = types;
        this.typeOptions = types.map((type) => ({
          value: type.id,
          label: type.name,
        }));
      },
      error: () => (this.error = 'Error loading types'),
    });
  }

  loadBrands() {
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.brandOptions = brands.map((brand) => ({
          value: brand.id,
          label: brand.name,
        }));
      },
      error: () => (this.error = 'Error loading brands'),
    });
  }

  submit() {
    console.log('=== FORM SUBMISSION DEBUG ===');
    this.isSubmitted = true;

    console.log('Form valid:', this.productForm.valid);
    console.log('Form value:', this.productForm.value);
    console.log('Form errors:', this.getFormErrors());

    if (this.productForm.invalid) {
      console.log('Form is invalid, stopping submission');
      return;
    }

    this.isLoading = true;
    this.error = null;
    console.log('Starting submission, isLoading set to true');

    const formValue = this.productForm.value;
    const imageValue = formValue.img;

    console.log('Image value:', imageValue);
    console.log('Image value type:', typeof imageValue);

    // Check if img is a File (from image upload component), string (URL), or empty
    if (
      imageValue &&
      typeof imageValue === 'object' &&
      'name' in imageValue &&
      'size' in imageValue
    ) {
      console.log('Submitting with image file:', imageValue);
      this.submitWithImageFile(imageValue as File);
    } else {
      // Handle both string URLs and null/undefined/empty values
      const imageUrl = typeof imageValue === 'string' ? imageValue : '';
      console.log('Submitting with image URL or no image:', imageUrl);
      this.submitWithImageUrl(imageUrl);
    }
  }

  private getFormErrors(): any {
    let formErrors: any = {};
    Object.keys(this.productForm.controls).forEach((key) => {
      const controlErrors = this.productForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    return formErrors;
  }

  private submitWithImageFile(imageFile: File): void {
    console.log('=== submitWithImageFile ===');
    const formValue = this.productForm.value;
    const dto: Omit<ProductCreateDto, 'img'> = {
      name: formValue.name || '',
      price: Number(formValue.price),
      rating: Number(formValue.rating),
      oldPrice: formValue.oldPrice ? Number(formValue.oldPrice) : undefined,
      discount: formValue.discount ? Number(formValue.discount) : undefined,
      typeId: Number(formValue.typeId),
      brandId: Number(formValue.brandId),
    };

    console.log('DTO:', dto);
    console.log('Image file:', imageFile);
    console.log('Calling productService.createProductWithImage...');

    this.productService.createProductWithImage(dto, imageFile).subscribe({
      next: (result) => {
        console.log('SUCCESS: Product created with image:', result);
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('ERROR: Failed to create product:', error);
        this.error = 'Cannot create product or upload image';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Request completed');
        this.isLoading = false;
      },
    });
  }

  private submitWithImageUrl(imageUrl: string): void {
    console.log('=== submitWithImageUrl ===');
    const formValue = this.productForm.value;
    const dto: ProductCreateDto = {
      name: formValue.name || '',
      price: Number(formValue.price),
      rating: Number(formValue.rating),
      oldPrice: formValue.oldPrice ? Number(formValue.oldPrice) : undefined,
      discount: formValue.discount ? Number(formValue.discount) : undefined,
      typeId: Number(formValue.typeId),
      brandId: Number(formValue.brandId),
    };

    // Добавляем img только если есть значение
    if (imageUrl && imageUrl.trim() !== '') {
      dto.img = imageUrl;
    }

    console.log('DTO:', dto);
    console.log('Calling productService.createProduct...');

    this.productService.createProduct(dto).subscribe({
      next: (result) => {
        console.log('SUCCESS: Product created:', result);
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('ERROR: Failed to create product:', error);
        this.error = 'Cannot create product';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Request completed');
        this.isLoading = false;
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
