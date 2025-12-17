import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartState } from '../../entities/cart/model/cart.state';
import { UserAddress } from '../../entities/user/model/user-address';
import { UserName } from '../../entities/user/model/user-name';
import { AddressFormComponent } from '../../entities/user/ui/address-form/address-form.component';
import { UserNameFormComponent } from '../../entities/user/ui/user-name-form/user-name-form.component';
import { OrderSummaryComponent } from '../../widgets/cart/order-summary/order-summary.component';

@Component({
  selector: 'app-checkout-page',
  imports: [OrderSummaryComponent, AddressFormComponent, UserNameFormComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  userName: UserName | undefined;
  userAddress: UserAddress | undefined;

  private router = inject(Router);
  private cartState = inject(CartState);

  get cartSummary() {
    return this.cartState.cart().summary;
  }

  onAddressChange(address: UserAddress) {
    this.userAddress = address;
  }

  onUserNameChange(userName: UserName) {
    this.userName = userName;
  }

  onCheckout() {
    const order = {
      user: this.userName,
      address: this.userAddress,
      cart: this.cartState.cart(),
    };
    console.log('Order placed:', order);

    this.router.navigate(['/payment'], { state: { order } });
  }
}
