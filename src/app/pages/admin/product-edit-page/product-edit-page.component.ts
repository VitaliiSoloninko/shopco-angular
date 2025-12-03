import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../entities/brand/api/brand.service';
import { Brand } from '../../../entities/brand/model/brand';
import { ProductService } from '../../../entities/product/api/product.service';
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
  selector: 'app-product-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    GrayLineComponent,
    ReactiveFormsModule,
    TextInputComponent,
    AdminSelectComponent,
  ],
  templateUrl: './product-edit-page.component.html',
  styleUrl: './product-edit-page.component.scss',
})
export class ProductEditPageComponent implements OnInit {
  productForm;
  isLoading = false;
  error: string | null = null;
  isSubmitted = false;
  productId: string | null = null;
  types: Type[] = [];
  brands: Brand[] = [];
  typeOptions: SelectOption[] = [];
  brandOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private typeService: TypeService,
    private brandService: BrandService,
    private route: ActivatedRoute,
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
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadTypes();
    this.loadBrands();
    if (this.productId) {
      this.loadProduct();
    }
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

  loadProduct() {
    if (this.productId) {
      this.isLoading = true;
      this.productService.getProduct(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue({
            name: product.name,
            price: product.price.toString(),
            rating: product.rating.toString(),
            img: product.img,
            oldPrice: product.oldPrice?.toString() || '',
            discount: product.discount?.toString() || '',
            typeId: product.typeId.toString(),
            brandId: product.brandId.toString(),
          });
        },
        error: () => {
          this.error = 'Error loading product';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  submit() {
    this.isSubmitted = true;
    if (this.productForm.invalid || !this.productId) return;
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

    this.productService.updateProduct(this.productId, dto).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => {
        this.error = 'Cannot update product';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
