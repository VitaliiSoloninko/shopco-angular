import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-card',
  imports: [RouterLink],
  templateUrl: './admin-dashboard-card.component.html',
  styleUrl: './admin-dashboard-card.component.scss',
})
export class AdminDashboardCardComponent {
  title = input<string>('');
  icon = input<string>();
  color = input<string>('#3b82f6');
  value = input<string | number>('');
  routerLink = input<string>();

  Math = Math;
}
