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
    this.isSubmitted = true;

    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

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

    this.productService.createProduct(dto).subscribe({
      next: (result) => {
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        this.error = 'Cannot create product';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
