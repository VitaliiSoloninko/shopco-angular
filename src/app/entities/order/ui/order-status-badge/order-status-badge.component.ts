import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-order-status-badge',
  imports: [CommonModule],
  templateUrl: './order-status-badge.component.html',
  styleUrl: './order-status-badge.component.scss',
})
export class OrderStatusBadgeComponent {
  status = input.required<string>();

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
