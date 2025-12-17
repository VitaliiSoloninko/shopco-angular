import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CART_URL } from '../../../urls';
import {
  AddToCartDto,
  CartResponse,
  UpdateCartItemDto,
} from '../model/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(CART_URL);
  }

  addToCart(dto: AddToCartDto): Observable<CartResponse> {
    return this.http.post<CartResponse>(CART_URL, dto);
  }

  /* Update cart item quantity on backend */
  updateItem(itemId: string, dto: UpdateCartItemDto): Observable<CartResponse> {
    return this.http.patch<CartResponse>(`${CART_URL}/${itemId}`, dto);
  }

  removeItem(itemId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${CART_URL}/${itemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(CART_URL);
  }
}
