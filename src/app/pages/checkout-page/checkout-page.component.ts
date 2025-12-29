import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartState } from '../../entities/cart/model/cart.state';
import { OrderService } from '../../entities/order/api/order.service';
import { CreateOrderDto } from '../../entities/order/model/order';
import { OrderNotesFormComponent } from '../../entities/order/ui/order-notes-form/order-notes-form.component';
import {
  extractAddressFromUser,
  UserAddress,
} from '../../entities/user/model/user-address';
import {
  extractNameFromUser,
  UserName,
} from '../../entities/user/model/user-name';
import { UserState } from '../../entities/user/model/user.state';
import { AddressFormComponent } from '../../entities/user/ui/address-form/address-form.component';
import { UserNameFormComponent } from '../../entities/user/ui/user-name-form/user-name-form.component';
import { OrderSummaryComponent } from '../../widgets/cart/order-summary/order-summary.component';

@Component({
  selector: 'app-checkout-page',
  imports: [
    OrderSummaryComponent,
    AddressFormComponent,
    UserNameFormComponent,
    OrderNotesFormComponent,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  userName: UserName | undefined;
  userAddress: UserAddress | undefined;
  orderNotes: string = '';

  private router = inject(Router);
  private cartState = inject(CartState);
  private userState = inject(UserState);
  private orderService = inject(OrderService);

  // Computed values for initial form values from user state
  initialUserName = computed(() => {
    const user = this.userState.currentUser();
    return user ? extractNameFromUser(user) : null;
  });

  initialAddress = computed(() => {
    const user = this.userState.currentUser();
    return user ? extractAddressFromUser(user) : null;
  });

  get cartSummary() {
    return this.cartState.cart().summary;
  }

  onAddressChange(address: UserAddress) {
    this.userAddress = address;
  }

  onUserNameChange(userName: UserName) {
    this.userName = userName;
  }

  onNotesChange(notes: string) {
    this.orderNotes = notes;
  }

  onCheckout() {
    if (!this.userName || !this.userAddress) {
      alert('Please fill in all required fields');
      return;
    }

    const currentUser = this.userState.currentUser();
    if (!currentUser) {
      alert('Please login to continue');
      this.router.navigate(['/login']);
      return;
    }

    const createOrderDto: CreateOrderDto = {
      paymentMethod: 'card',
      firstName: this.userName.firstName,
      lastName: this.userName.lastName,
      email: currentUser.email,
      street: this.userAddress.street,
      city: this.userAddress.city,
      postalCode: this.userAddress.postalCode,
      country: this.userAddress.country,
      phone: this.userAddress.phone,
      notes: this.orderNotes || undefined,
      shippingCost: this.cartSummary.deliveryFee,
      tax: 0, // Can be calculated based on business logic
    };

    this.orderService.createUserOrder(createOrderDto).subscribe({
      next: (order) => {
        console.log('Order created successfully:', order);
        // Navigate to payment page with order data
        this.router.navigate(['/payment'], { state: { order } });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again.');
      },
    });
  }
}
