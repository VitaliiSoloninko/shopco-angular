import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../../product/model/product';
import { AuthService } from '../../user/api/auth.service';
import { CartService } from '../api/cart.service';
import { AddToCartDto, Cart, CartItem, CartSummary } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartState {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  // Signals for state management
  private cartItems = signal<CartItem[]>([]);
  private cartSummary = signal<CartSummary>({
    subtotal: 0,
    discount: 0,
    discountPercentage: 0,
    deliveryFee: 0,
    total: 0,
  });

  // Public computed signals
  cart = computed(
    () =>
      ({
        items: this.cartItems(),
        summary: this.cartSummary(),
      } as Cart)
  );

  itemsCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    // Load cart from backend if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadCart();
    }
  }

  // Public methods
  addToCart(
    product: Product,
    selectedSize: string,
    quantity: number,
    selectedColor?: string
  ): void {
    if (this.authService.isAuthenticated()) {
      // User is authenticated - save to backend
      const dto: AddToCartDto = {
        productId: product.id,
        quantity,
        selectedSize,
        selectedColor,
      };
      this.cartService.addToCart(dto).subscribe({
        next: (response) => {
          this.cartItems.set(response.items);
          this.cartSummary.set(response.summary);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          // On error, add to memory only
          this.addToCartMemory(product, selectedSize, quantity, selectedColor);
        },
      });
    } else {
      // User not authenticated - save to memory only
      this.addToCartMemory(product, selectedSize, quantity, selectedColor);
    }
  }

  updateQuantity(itemId: string | number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    if (this.authService.isAuthenticated()) {
      // User is authenticated - update on backend
      this.cartService.updateItem(itemId.toString(), { quantity }).subscribe({
        next: (response) => {
          this.cartItems.set(response.items);
          this.cartSummary.set(response.summary);
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          // On error, update memory only
          this.updateQuantityMemory(itemId, quantity);
        },
      });
    } else {
      // User not authenticated - update memory only
      this.updateQuantityMemory(itemId, quantity);
    }
  }

  removeFromCart(itemId: string | number): void {
    if (this.authService.isAuthenticated()) {
      // User is authenticated - delete from backend
      this.cartService.removeItem(itemId.toString()).subscribe({
        next: (response) => {
          this.cartItems.set(response.items);
          this.cartSummary.set(response.summary);
        },
        error: (error) => {
          console.error('Error removing item:', error);
          // On error, remove from memory only
          this.removeFromCartMemory(itemId);
        },
      });
    } else {
      // User not authenticated - remove from memory only
      this.removeFromCartMemory(itemId);
    }
  }

  clearCart(): void {
    if (this.authService.isAuthenticated()) {
      // User is authenticated - clear on backend
      this.cartService.clearCart().subscribe({
        next: () => {
          this.cartItems.set([]);
          this.cartSummary.set({
            subtotal: 0,
            discount: 0,
            discountPercentage: 0,
            deliveryFee: 0,
            total: 0,
          });
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          // On error, clear memory only
          this.clearCartMemory();
        },
      });
    } else {
      // User not authenticated - clear memory only
      this.clearCartMemory();
    }
  }

  getCurrentCart(): Cart {
    return this.cart();
  }

  // Sync cart to backend after login
  syncCartAfterLogin(): void {
    const items = this.cartItems();
    if (items.length > 0 && this.authService.isAuthenticated()) {
      // Send all items to backend
      items.forEach((item) => {
        const dto: AddToCartDto = {
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        };
        this.cartService.addToCart(dto).subscribe({
          next: (response) => {
            // Update state with latest backend data
            this.cartItems.set(response.items);
            this.cartSummary.set(response.summary);
          },
        });
      });
    }
  }

  // Private methods
  private loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartItems.set(response.items);
        this.cartSummary.set(response.summary);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      },
    });
  }

  private generateItemId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Memory-only methods (for unauthenticated users)
  private addToCartMemory(
    product: Product,
    selectedSize: string,
    quantity: number,
    selectedColor?: string
  ): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
      this.cartItems.set(updatedItems);
    } else {
      const newItem: CartItem = {
        id: this.generateItemId(),
        product,
        selectedSize,
        selectedColor,
        quantity,
        maxQuantity: 99,
        addedAt: new Date(),
      };
      this.cartItems.set([...currentItems, newItem]);
    }
    this.updateMemorySummary();
  }

  private updateQuantityMemory(
    itemId: string | number,
    quantity: number
  ): void {
    const updatedItems = this.cartItems().map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.cartItems.set(updatedItems);
    this.updateMemorySummary();
  }

  private removeFromCartMemory(itemId: string | number): void {
    const updatedItems = this.cartItems().filter((item) => item.id !== itemId);
    this.cartItems.set(updatedItems);
    this.updateMemorySummary();
  }

  private clearCartMemory(): void {
    this.cartItems.set([]);
    this.updateMemorySummary();
  }

  private updateMemorySummary(): void {
    const items = this.cartItems();
    const subtotal = items.reduce(
      (sum, item) =>
        sum + (item.product.oldPrice ?? item.product.price) * item.quantity,
      0
    );
    const totalDiscount = items.reduce((sum, item) => {
      if (item.product.oldPrice && item.product.oldPrice > item.product.price) {
        return (
          sum + (item.product.oldPrice - item.product.price) * item.quantity
        );
      }
      return sum;
    }, 0);
    const discountPercentage =
      subtotal > 0 ? Math.round((totalDiscount / subtotal) * 100) : 0;
    const deliveryFee = 0;
    const total = subtotal - totalDiscount + deliveryFee;

    this.cartSummary.set({
      subtotal,
      discount: totalDiscount,
      discountPercentage,
      deliveryFee,
      total,
    });
  }
}
