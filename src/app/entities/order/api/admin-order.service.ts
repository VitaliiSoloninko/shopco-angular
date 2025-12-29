import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_ORDERS_URL } from '../../../urls';
import { Order, UpdateOrderStatusDto } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  private http = inject(HttpClient);

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(ADMIN_ORDERS_URL);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${ADMIN_ORDERS_URL}/${id}`);
  }

  updateOrderStatus(id: number, dto: UpdateOrderStatusDto): Observable<Order> {
    return this.http.patch<Order>(`${ADMIN_ORDERS_URL}/${id}`, dto);
  }
}
