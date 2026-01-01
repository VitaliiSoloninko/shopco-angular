import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { getImageUrl } from '../../../../shared/utils/image.utils';
import { Order } from '../../model/order';
import { OrderStatusBadgeComponent } from '../order-status-badge/order-status-badge.component';
import { PaymentStatusBadgeComponent } from '../payment-status-badge/payment-status-badge.component';

@Component({
  selector: 'app-user-order-card',
  imports: [DatePipe, OrderStatusBadgeComponent, PaymentStatusBadgeComponent],
  templateUrl: './user-order-card.component.html',
  styleUrl: './user-order-card.component.scss',
})
export class UserOrderCardComponent {
  order = input.required<Order>();
  getImageUrl = getImageUrl;
}
