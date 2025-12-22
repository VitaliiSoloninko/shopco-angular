import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDERS_URL } from '../../../urls';
import { CreateOrderDto, Order, UpdateOrderStatusDto } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  createOrder(dto: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(ORDERS_URL, dto);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDERS_URL);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${ORDERS_URL}/${id}`);
  }

  updateOrderStatus(id: number, dto: UpdateOrderStatusDto): Observable<Order> {
    return this.http.patch<Order>(`${ORDERS_URL}/${id}`, dto);
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${ORDERS_URL}/${id}`);
  }
}
