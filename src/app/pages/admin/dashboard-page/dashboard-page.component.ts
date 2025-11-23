import { Component, signal } from '@angular/core';
import { BRANDS } from '../../../data/brands.data';
import { ORDERS } from '../../../data/orders.data';
import { PRODUCTS_DATA } from '../../../data/products.data';
import { TYPES } from '../../../data/types.data';
import { USERS } from '../../../data/users.data';
import { AdminDashboardCardComponent } from '../../../shared/ui/admin-dashboard-card/admin-dashboard-card.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [GrayLineComponent, AdminDashboardCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  stats = signal({
    totalProducts: PRODUCTS_DATA.rows.length,
    totalBrands: BRANDS.length,
    totalTypes: TYPES.length,
    totalUsers: USERS.length,
    totalOrders: ORDERS.length,
    totalRevenue: this.calculateTotalRevenue(),
  });

  // last 5 orders
  recentOrders = signal(ORDERS.slice(0, 5));

  private calculateTotalRevenue(): number {
    return ORDERS.reduce((total, order) => {
      return total + order.cart.summary.total;
    }, 0);
  }
}
