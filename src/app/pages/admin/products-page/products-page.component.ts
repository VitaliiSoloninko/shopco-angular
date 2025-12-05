import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../entities/product/api/product.service';
import { Product } from '../../../entities/product/model/product';
import { AdminEntity } from '../../../shared/models/admin-entity.model';
import { AddButtonComponent } from '../../../shared/ui/add-button/add-button.component';
import { AdminProductListComponent } from '../../../shared/ui/admin-product-list/admin-product-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { IMAGES_BASE_URL } from '../../../urls';

@Component({
  selector: 'app-products-page',
  imports: [
    CommonModule,
    GrayLineComponent,
    AdminProductListComponent,
    ModalComponent,
    LoaderComponent,
    AddButtonComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  adminEntities: AdminEntity[] = [];
  productService = inject(ProductService);
  router = inject(Router);
  loading = false;
  showConfirm = false;
  productIdToDelete: number | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        this.adminEntities = response.products.map((p: Product) => ({
          id: p.id!,
          name: p.name,
          img: this.getImageUrl(p.img),
          price: p.price,
          hasImage: !!p.img,
        }));
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onDeleteProduct(productId: number) {
    this.productIdToDelete = productId;
    this.showConfirm = true;
  }

  onConfirm() {
    if (this.productIdToDelete !== null) {
      this.productService
        .deleteProduct(this.productIdToDelete.toString())
        .subscribe(() => {
          this.loadProducts();
          this.showConfirm = false;
          this.productIdToDelete = null;
        });
    }
  }

  onCancel() {
    this.showConfirm = false;
    this.productIdToDelete = null;
  }

  onAddProduct() {
    this.router.navigate(['admin/products/create']);
  }

  onEditProduct(entity: AdminEntity) {
    this.router.navigate(['admin/products/edit', entity.id]);
  }

  private getImageUrl(imagePath: string | null): string | null {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If it's a relative path, add base URL
    return IMAGES_BASE_URL + imagePath;
  }
}
