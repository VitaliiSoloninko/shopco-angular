import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../entities/cart/api/cart.service';
import { AuthService } from '../../../entities/user/api/auth.service';
import { UserState } from '../../../entities/user/model/user.state';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { BurgerMenuComponent } from '../../../shared/ui/burger-menu/burger-menu.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, BurgerMenuComponent, RouterLinkActive, BadgeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  userState = inject(UserState);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  get cartItemsCount() {
    return this.cartService.itemsCount();
  }

  get isAuthenticated() {
    return this.userState.getAccessToken() !== null;
  }

  get currentUser() {
    return this.userState.currentUser();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  onLogout() {
    this.authService.logout();
    this.userState.clearUserState();
  }
}
