import { Component, signal } from '@angular/core';
import { Order, ORDERS, OrderStatus } from '../../../data/orders.data';
import { AdminOrderCardComponent } from '../../../shared/ui/admin-order-card/admin-order-card.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';

@Component({
  selector: 'app-orders-page',
  imports: [GrayLineComponent, AdminOrderCardComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
})
export class OrdersPageComponent {
  orders = signal<Order[]>([...ORDERS]);

  onEditOrder(order: Order) {
    console.log('Edit order:', order);
  }

  onDeleteOrder(orderId: number) {
    this.orders.update((orders) =>
      orders.filter((order) => order.id !== orderId)
    );
    console.log('Delete order with id:', orderId);
  }

  onStatusChange(event: { orderId: number; status: OrderStatus }) {
    this.orders.update((orders) =>
      orders.map((order) =>
        order.id === event.orderId
          ? {
              ...order,
              status: event.status,
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
    console.log('Status changed:', event);
  }

  onAddOrder() {
    console.log('Add new order');
  }
}
