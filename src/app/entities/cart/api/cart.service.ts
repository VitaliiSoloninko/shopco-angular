import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CART_URL } from '../../../urls';
import { Product } from '../../product/model/product';
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
  private cartItems = signal<CartItem[]>([]);
  private cartSummarySignal = signal<CartSummary>({
    subtotal: 0,
    discount: 0,
    discountPercentage: 0,
    deliveryFee: 0,
    total: 0,
  });
  private useBackend = true; // Toggle for backend usage

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
    if (this.useBackend) {
      this.loadCartFromBackend().subscribe({
        error: () => {
          // Fallback to localStorage if backend fails
          this.loadCartFromStorage();
        },
      });
    } else {
      this.loadCartFromStorage();
    }
  }

  // Add product to cart
  addToCart(
    product: Product,
    selectedSize: string,
    quantity: number,
    selectedColor?: string
  ): void {
    if (this.useBackend) {
      const dto: AddToCartDto = {
        productId: product.id,
        quantity,
        selectedSize,
        selectedColor,
      };
      this.addToCartBackend(dto).subscribe({
        error: (error) => {
          console.error('Error adding to cart:', error);
          // Fallback to localStorage
          this.addToCartLocal(product, selectedSize, quantity, selectedColor);
        },
      });
    } else {
      this.addToCartLocal(product, selectedSize, quantity, selectedColor);
    }
  }

  // Update item quantity
  updateQuantity(itemId: string | number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    if (this.useBackend) {
      this.updateCartItemBackend(itemId.toString(), { quantity }).subscribe({
        error: (error) => {
          console.error('Error updating quantity:', error);
          // Fallback to localStorage
          this.updateQuantityLocal(itemId.toString(), quantity);
        },
      });
    } else {
      this.updateQuantityLocal(itemId.toString(), quantity);
    }
  }

  // Remove item from cart
  removeFromCart(itemId: string | number): void {
    if (this.useBackend) {
      this.removeCartItemBackend(itemId.toString()).subscribe({
        error: (error) => {
          console.error('Error removing item:', error);
          // Fallback to localStorage
          this.removeFromCartLocal(itemId.toString());
        },
      });
    } else {
      this.removeFromCartLocal(itemId.toString());
    }
  }

  // Clear entire cart
  clearCart(): void {
    if (this.useBackend) {
      this.clearCartBackend().subscribe({
        error: (error) => {
          console.error('Error clearing cart:', error);
          // Fallback to localStorage
          this.clearCartLocal();
        },
      });
    } else {
      this.clearCartLocal();
    }
  }

  // Get current cart state
  getCurrentCart(): Cart {
    return this.cart();
  }

  // Private methods
  private generateItemId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart);
        // Verify that data is an array
        if (Array.isArray(parsedItems)) {
          this.cartItems.set(parsedItems);
        } else {
          console.warn(
            'Invalid cart data in localStorage, resetting to empty array'
          );
          this.cartItems.set([]);
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.cartItems.set([]); // Set empty array on error
      }
    }
  }

  // Local methods (localStorage fallback)
  private addToCartLocal(
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
    this.updateLocalSummary();
    this.saveCartToStorage();
  }

  private updateQuantityLocal(itemId: string, quantity: number): void {
    const updatedItems = this.cartItems().map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.cartItems.set(updatedItems);
    this.updateLocalSummary();
    this.saveCartToStorage();
  }

  private removeFromCartLocal(itemId: string): void {
    const updatedItems = this.cartItems().filter((item) => item.id !== itemId);
    this.cartItems.set(updatedItems);
    this.updateLocalSummary();
    this.saveCartToStorage();
  }

  private clearCartLocal(): void {
    this.cartItems.set([]);
    this.updateLocalSummary();
    this.saveCartToStorage();
  }

  private updateLocalSummary(): void {
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
