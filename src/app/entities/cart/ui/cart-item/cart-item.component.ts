import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { QuantityControlComponent } from '../../../../shared/ui/quantity-control/quantity-control.component';
import { IMAGES_BASE_URL } from '../../../../urls';
import { CartItem } from '../../model/cart-item';

@Component({
  selector: 'app-cart-item',
  imports: [QuantityControlComponent, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  cartItem = input<CartItem>();
  quantityChanged = output<{ id: string | number; quantity: number }>();
  itemRemoved = output<string | number>();
  quantitySize: 'big' | 'medium' | 'small' = 'medium';
  private router = inject(Router);

  constructor() {
    this.updateQuantitySize();
    window.addEventListener('resize', this.updateQuantitySize.bind(this));
  }

  updateQuantitySize() {
    if (window.innerWidth < 480) this.quantitySize = 'small';
    else this.quantitySize = 'medium';
  }

  goToProductDetail() {
    const item = this.cartItem();
    if (item) {
      this.router.navigate(['/product', item.product.id]);
    }
  }

  quantity = computed(() => this.cartItem()?.quantity || 1);

  onQuantityChange(newQuantity: number): void {
    const item = this.cartItem();
    if (item) {
      this.quantityChanged.emit({
        id: item.id,
        quantity: newQuantity,
      });
    }
  }

  onRemoveItem(): void {
    const item = this.cartItem();
    if (item) {
      this.itemRemoved.emit(item.id);
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return IMAGES_BASE_URL + imagePath;
  }
}
