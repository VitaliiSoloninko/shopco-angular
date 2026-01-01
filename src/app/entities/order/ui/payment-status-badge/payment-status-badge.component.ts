import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-payment-status-badge',
  imports: [CommonModule],
  templateUrl: './payment-status-badge.component.html',
  styleUrl: './payment-status-badge.component.scss',
})
export class PaymentStatusBadgeComponent {
  status = input.required<string>();

  getStatusClass(status: string): string {
    return `payment-status-${status}`;
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      paid: 'Paid',
      failed: 'Failed',
      refunded: 'Refunded',
    };
    return statusMap[status] || status;
  }
}
