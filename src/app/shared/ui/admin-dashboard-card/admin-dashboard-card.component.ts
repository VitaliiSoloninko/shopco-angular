import { Component, input } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-card',
  imports: [],
  templateUrl: './admin-dashboard-card.component.html',
  styleUrl: './admin-dashboard-card.component.scss',
})
export class AdminDashboardCardComponent {
  title = input<string>('');
  value = input<string | number>('');
  icon = input<string>();
  color = input<string>('#3b82f6');

  Math = Math;
}
