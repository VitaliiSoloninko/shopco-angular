import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartState } from '../../entities/cart/model/cart.state';
import { CartItemComponent } from '../../entities/cart/ui/cart-item/cart-item.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { GrayLineComponent } from '../../shared/ui/gray-line/gray-line.component';
import { OrderSummaryComponent } from '../../widgets/cart/order-summary/order-summary.component';

@Component({
  selector: 'app-cart-page',
  imports: [
    OrderSummaryComponent,
    CartItemComponent,
    GrayLineComponent,
    EmptyStateComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  private cartState = inject(CartState);
  private router = inject(Router);

  ngOnInit(): void {
    // Cart automatically loads in CartState constructor
  }

  get cartItems() {
    return this.cartState.cart().items;
  }

  get cartSummary() {
    return this.cartState.cart().summary;
  }

  onQuantityChange(event: { id: string | number; quantity: number }): void {
    this.cartState.updateQuantity(event.id, event.quantity);
  }

  onRemoveItem(itemId: string | number): void {
    this.cartState.removeFromCart(itemId);
  }

  onCheckout(): void {
    this.router.navigate(['/checkout']);
    console.log('Proceeding to checkout with total:', this.cartSummary.total);
    console.log('Cart items:', this.cartItems);
  }
}
