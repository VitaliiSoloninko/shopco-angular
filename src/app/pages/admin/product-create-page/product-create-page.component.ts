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
import { TypeService } from '../../../entities/type/api/type.service';
import { Type } from '../../../entities/type/model/type';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { TextInputComponent } from '../../../shared/ui/inputs/text-input/text-input.component';

@Component({
  selector: 'app-product-create-page',
  standalone: true,
  imports: [
    CommonModule,
    GrayLineComponent,
    ReactiveFormsModule,
    TextInputComponent,
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
      img: ['', [Validators.required]],
      oldPrice: [''],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      typeId: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
    });
  }

  get fc() {
    return {
      name: this.productForm.get('name')!,
      price: this.productForm.get('price')!,
      rating: this.productForm.get('rating')!,
      img: this.productForm.get('img')!,
      oldPrice: this.productForm.get('oldPrice')!,
      discount: this.productForm.get('discount')!,
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
      next: (types) => (this.types = types),
      error: () => (this.error = 'Error loading types'),
    });
  }

  loadBrands() {
    this.brandService.getBrands().subscribe({
      next: (brands) => (this.brands = brands),
      error: () => (this.error = 'Error loading brands'),
    });
  }

  submit() {
    this.isSubmitted = true;
    if (this.productForm.invalid) return;
    this.isLoading = true;
    this.error = null;

    const formValue = this.productForm.value;
    const dto = {
      name: formValue.name || '',
      price: Number(formValue.price),
      rating: Number(formValue.rating),
      img: formValue.img || '',
      oldPrice: formValue.oldPrice ? Number(formValue.oldPrice) : undefined,
      discount: formValue.discount ? Number(formValue.discount) : undefined,
      typeId: Number(formValue.typeId),
      brandId: Number(formValue.brandId),
    };

    this.productService.createProduct(dto).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => {
        this.error = 'Cannot create product';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
