import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Order } from '../../model/order';

@Component({
  selector: 'app-user-order-card',
  imports: [CommonModule, DatePipe],
  templateUrl: './user-order-card.component.html',
  styleUrl: './user-order-card.component.scss',
})
export class UserOrderCardComponent {
  order = input.required<Order>();

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  }
}
