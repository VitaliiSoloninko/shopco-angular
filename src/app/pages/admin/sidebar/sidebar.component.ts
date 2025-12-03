import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isSidebarSmall = input.required<boolean>();
  changeSidebarState = output<boolean>();

  menuItems = [
    {
      routerLink: 'dashboard',
      icon: '/images/svg/admin/dashboard.svg',
      linkText: 'Dashboard',
    },
    {
      routerLink: 'brands',
      icon: '/images/svg/admin/chromium.svg',
      linkText: 'Brands',
    },
    {
      routerLink: 'types',
      icon: '/images/svg/admin/type.svg',
      linkText: 'Types',
    },
    {
      routerLink: 'products',
      icon: '/images/svg/admin/shirt.svg',
      linkText: 'Products',
    },
    {
      routerLink: 'users',
      icon: '/images/svg/admin/users.svg',
      linkText: 'Users',
    },
    {
      routerLink: 'orders',
      icon: '/images/svg/admin/list-ordered.svg',
      linkText: 'Orders',
    },
    {
      routerLink: '/',
      icon: '/images/svg/admin/house.svg',
      linkText: 'Home page',
    },
    {
      routerLink: 'modal',
      icon: '/images/svg/admin/settings.svg',
      linkText: 'Test - Modal windows',
    },
    {
      routerLink: 'empty-state',
      icon: '/images/svg/admin/settings.svg',
      linkText: 'Test - Empty state',
    },
    {
      routerLink: 'image-upload-test',
      icon: '/images/svg/admin/settings.svg',
      linkText: 'Test - Image Upload',
    },
    {
      routerLink: 'settings',
      icon: '/images/svg/admin/settings.svg',
      linkText: 'Test - Settings',
    },
  ];

  toggleSidebarLogo(): void {
    this.changeSidebarState.emit(!this.isSidebarSmall());
  }

  closeSidebar(): void {
    this.changeSidebarState.emit(true);
  }
}
