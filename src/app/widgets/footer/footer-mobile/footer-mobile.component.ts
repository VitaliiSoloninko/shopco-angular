import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartState } from '../../../entities/cart/model/cart.state';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-footer-mobile',
  imports: [RouterLink, RouterLinkActive, BadgeComponent],
  templateUrl: './footer-mobile.component.html',
  styleUrl: './footer-mobile.component.scss',
})
export class FooterMobileComponent {
  private cartState = inject(CartState);

  get cartItemsCount() {
    return this.cartState.itemsCount();
  }
}
