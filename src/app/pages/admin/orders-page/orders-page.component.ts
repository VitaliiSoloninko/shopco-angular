import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderStatus } from '../../../data/orders.data';
import { OrderService } from '../../../entities/order/api/order.service';
import { Order } from '../../../entities/order/model/order';
import { AdminOrderCardComponent } from '../../../shared/ui/admin-order-card/admin-order-card.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';

@Component({
  selector: 'app-orders-page',
  imports: [GrayLineComponent, AdminOrderCardComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
})
export class OrdersPageComponent implements OnInit {
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

    this.orderService.getOrders().subscribe({
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

  onEditOrder(order: Order) {
    console.log('Edit order:', order);
  }

  onDeleteOrder(orderId: number) {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.orderService
      .updateOrderStatus(orderId, { status: 'cancelled' })
      .subscribe({
        next: (updatedOrder) => {
          this.orders.update((orders) =>
            orders.map((order) => (order.id === orderId ? updatedOrder : order))
          );
          console.log('Order cancelled successfully');
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          alert('Failed to cancel order. Please try again.');
        },
      });
  }

  onStatusChange(event: { orderId: number; status: OrderStatus }) {
    this.orderService
      .updateOrderStatus(event.orderId, { status: event.status })
      .subscribe({
        next: (updatedOrder) => {
          this.orders.update((orders) =>
            orders.map((order) =>
              order.id === event.orderId ? updatedOrder : order
            )
          );
          console.log('Order status updated successfully');
        },
        error: (err) => {
          console.error('Error updating order status:', err);
          alert('Failed to update order status. Please try again.');
        },
      });
  }

  onAddOrder() {
    console.log('Add new order');
  }
}
