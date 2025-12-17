import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CART_URL } from '../../../urls';
import { Product } from '../../product/model/product';
import { AuthService } from '../../user/api/auth.service';
import {
  AddToCartDto,
  Cart,
  CartItem,
  CartResponse,
  CartSummary,
  UpdateCartItemDto,
} from '../model/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cartItems = signal<CartItem[]>([]);
  private cartSummarySignal = signal<CartSummary>({
    subtotal: 0,
    discount: 0,
    discountPercentage: 0,
    deliveryFee: 0,
    total: 0,
  });

  // Computed signal for complete cart
  cart = computed(
    () =>
      ({
        items: this.cartItems(),
        summary: this.cartSummarySignal(),
      } as Cart)
  );

  // Computed signal for total items count
  itemsCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    // Load cart from backend if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadCartFromBackend().subscribe();
    }
  }

  // Add product to cart
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
      this.addToCartBackend(dto).subscribe({
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

  // Update item quantity
  updateQuantity(itemId: string | number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    if (this.authService.isAuthenticated()) {
      // User is authenticated - update on backend
      this.updateCartItemBackend(itemId.toString(), { quantity }).subscribe({
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

  // Remove item from cart
  removeFromCart(itemId: string | number): void {
    if (this.authService.isAuthenticated()) {
      // User is authenticated - delete from backend
      this.removeCartItemBackend(itemId.toString()).subscribe({
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

  // Clear entire cart
  clearCart(): void {
    if (this.authService.isAuthenticated()) {
      // User is authenticated - clear on backend
      this.clearCartBackend().subscribe({
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

  // Get current cart state
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
        this.addToCartBackend(dto).subscribe();
      });
    }
  }

  // Private methods
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

    this.cartSummarySignal.set({
      subtotal,
      discount: totalDiscount,
      discountPercentage,
      deliveryFee,
      total,
    });
  }

  // Backend API methods
  private loadCartFromBackend(): Observable<CartResponse> {
    return this.http.get<CartResponse>(CART_URL).pipe(
      tap((response) => {
        this.cartItems.set(response.items);
        this.cartSummarySignal.set(response.summary);
      })
    );
  }

  private addToCartBackend(dto: AddToCartDto): Observable<CartResponse> {
    return this.http.post<CartResponse>(CART_URL, dto).pipe(
      tap((response) => {
        this.cartItems.set(response.items);
        this.cartSummarySignal.set(response.summary);
      })
    );
  }

  private updateCartItemBackend(
    itemId: string,
    dto: UpdateCartItemDto
  ): Observable<CartResponse> {
    return this.http.patch<CartResponse>(`${CART_URL}/${itemId}`, dto).pipe(
      tap((response) => {
        this.cartItems.set(response.items);
        this.cartSummarySignal.set(response.summary);
      })
    );
  }

  private removeCartItemBackend(itemId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${CART_URL}/${itemId}`).pipe(
      tap((response) => {
        this.cartItems.set(response.items);
        this.cartSummarySignal.set(response.summary);
      })
    );
  }

  private clearCartBackend(): Observable<void> {
    return this.http.delete<void>(CART_URL).pipe(
      tap(() => {
        this.cartItems.set([]);
        this.cartSummarySignal.set({
          subtotal: 0,
          discount: 0,
          discountPercentage: 0,
          deliveryFee: 0,
          total: 0,
        });
      })
    );
  }
}
