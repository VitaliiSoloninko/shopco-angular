import { Component, EventEmitter, input, Output } from '@angular/core';
import { Order, OrderStatus } from '../../../data/orders.data';
import { OrderStatusBadgeComponent } from '../../../entities/order/ui/order-status-badge/order-status-badge.component';
import { PaymentStatusBadgeComponent } from '../../../entities/order/ui/payment-status-badge/payment-status-badge.component';
import { getImageUrl } from '../../utils/image.utils';

@Component({
  selector: 'app-admin-order-card',
  imports: [OrderStatusBadgeComponent, PaymentStatusBadgeComponent],
  templateUrl: './admin-order-card.component.html',
  styleUrl: './admin-order-card.component.scss',
})
export class AdminOrderCardComponent {
  order = input.required<Order>();
  getImageUrl = getImageUrl;

  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{
    orderId: number;
    status: OrderStatus;
  }>();

  statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: '#fbbf24' },
    { value: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
    { value: 'processing', label: 'Processing', color: '#8b5cf6' },
    { value: 'shipped', label: 'Shipped', color: '#f59e0b' },
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
  ];

  getStatusColor(status: OrderStatus): string {
    return (
      this.statusOptions.find((option) => option.value === status)?.color ||
      '#6b7280'
    );
  }

  getStatusLabel(status: OrderStatus): string {
    return (
      this.statusOptions.find((option) => option.value === status)?.label ||
      status
    );
  }

  onDelete() {
    this.delete.emit(this.order().id);
  }

  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as OrderStatus;
    this.statusChange.emit({ orderId: this.order().id, status: newStatus });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
