import { Routes } from '@angular/router';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

import { AdminComponent } from './pages/admin/admin.component';
import { BrandsPageComponent } from './pages/admin/brands-page/brands-page.component';
import { DashboardPageComponent } from './pages/admin/dashboard-page/dashboard-page.component';
import { OrdersPageComponent } from './pages/admin/orders-page/orders-page.component';
import { ProductsPageComponent } from './pages/admin/products-page/products-page.component';
import { SettingsPageComponent } from './pages/admin/settings-page/settings-page.component';
import { TypesPageComponent } from './pages/admin/types-page/types-page.component';
import { UsersPageComponent } from './pages/admin/users-page/users-page.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { FavoritesPageComponent } from './pages/favorites-page/favorites-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { ProductCatalogPageComponent } from './pages/product-catalog-page/product-catalog-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { ProfileEditPageComponent } from './pages/profile-edit-page/profile-edit-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SuccessPageComponent } from './pages/success-page/success-page.component';
import { EmptyStateTestComponent } from './pages/test-pages/empty-state-test/empty-state-test.component';
import { ModalTestComponent } from './pages/test-pages/modal-test/modal-test.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'catalog', component: ProductCatalogPageComponent },
      { path: 'product/:id', component: ProductDetailPageComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'checkout', component: CheckoutPageComponent },
      { path: 'payment', component: PaymentPageComponent },
      { path: 'success', component: SuccessPageComponent },
      { path: 'favorites', component: FavoritesPageComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'profile/edit', component: ProfileEditPageComponent },
      { path: 'modal', component: ModalTestComponent },
      { path: 'empty-state', component: EmptyStateTestComponent },
    ],
  },

  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'products', component: ProductsPageComponent },
      { path: 'brands', component: BrandsPageComponent },
      { path: 'types', component: TypesPageComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'orders', component: OrdersPageComponent },
      { path: 'settings', component: SettingsPageComponent },
    ],
  },
];
