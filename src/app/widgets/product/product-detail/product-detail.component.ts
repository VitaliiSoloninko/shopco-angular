import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartState } from '../../../entities/cart/model/cart.state';
import { CartToastComponent } from '../../../entities/cart/ui/cart-toast/cart-toast.component';
import { ProductService } from '../../../entities/product/api/product.service';
import { Product } from '../../../entities/product/model/product';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';
import { QuantityControlComponent } from '../../../shared/ui/quantity-control/quantity-control.component';
import { SizeSelectorComponent } from '../../../shared/ui/size-selector/size-selector.component';
import { IMAGES_BASE_URL } from '../../../urls';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    SizeSelectorComponent,
    QuantityControlComponent,
    GrayLineComponent,
    CartToastComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  sizes = ['Small', 'Medium', 'Large', 'X-Large'];
  selectedSize = 'Large';
  quantity = 1;

  isToastOpen = false;
  private toastTimeout: any;

  route = inject(ActivatedRoute);
  cartState = inject(CartState);
  router = inject(Router);
  productService = inject(ProductService);

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(productId).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.product = null;
        },
      });
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return IMAGES_BASE_URL + imagePath;
  }

  get currentPrice() {
    return this.product?.price || 0;
  }

  get originalPrice() {
    return this.product?.oldPrice || 0;
  }

  get discount() {
    if (!this.product?.oldPrice || !this.product?.price) return 0;
    return Math.round(
      ((this.product.oldPrice - this.product.price) / this.product.oldPrice) *
        100
    );
  }

  onSizeSelected(size: string) {
    this.selectedSize = size;
  }

  onQuantityChange(newQuantity: number) {
    this.quantity = newQuantity;
  }

  addToCart() {
    if (!this.product || !this.selectedSize || this.quantity <= 0) {
      alert('Please select size and quantity');
      return;
    }
    this.cartState.addToCart(this.product, this.selectedSize, this.quantity);

    this.isToastOpen = true;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.onToastClose(), 2000);

    console.log('Added to cart:', {
      product: this.product,
      size: this.selectedSize,
      quantity: this.quantity,
      price: this.currentPrice,
    });
  }

  onToastClose() {
    this.isToastOpen = false;
    clearTimeout(this.toastTimeout);
  }

  goToCart() {
    this.onToastClose();
    this.router.navigate(['/cart']);
  }
}
