import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../entities/order/api/order.service';
import { Order } from '../../../entities/order/model/order';
import { UserOrderCardComponent } from '../../../entities/order/ui/user-order-card/user-order-card.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-user-orders-page',
  imports: [UserOrderCardComponent, RouterLink, EmptyStateComponent],
  templateUrl: './user-orders-page.component.html',
  styleUrl: './user-orders-page.component.scss',
})
export class UserOrdersPageComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.error.set(null);

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error.set('Failed to load orders. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
