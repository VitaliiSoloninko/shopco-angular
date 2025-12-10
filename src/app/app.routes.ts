import { Routes } from '@angular/router';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { adminGuard, authGuard } from './shared/guards/auth.guard';

import { AdminComponent } from './pages/admin/admin.component';
import { BrandCreatePageComponent } from './pages/admin/brand-create-page/brand-create-page.component';
import { BrandEditPageComponent } from './pages/admin/brand-edit-page/brand-edit-page.component';
import { BrandsPageComponent } from './pages/admin/brands-page/brands-page.component';
import { DashboardPageComponent } from './pages/admin/dashboard-page/dashboard-page.component';
import { OrdersPageComponent } from './pages/admin/orders-page/orders-page.component';
import { ProductCreatePageComponent } from './pages/admin/product-create-page/product-create-page.component';
import { ProductEditPageComponent } from './pages/admin/product-edit-page/product-edit-page.component';
import { ProductImageUploadPageComponent } from './pages/admin/product-image-upload-page/product-image-upload-page.component';
import { ProductsPageComponent } from './pages/admin/products-page/products-page.component';
import { SettingsPageComponent } from './pages/admin/settings-page/settings-page.component';
import { TypeCreatePageComponent } from './pages/admin/type-create-page/type-create-page.component';
import { TypeEditPageComponent } from './pages/admin/type-edit-page/type-edit-page.component';
import { TypesPageComponent } from './pages/admin/types-page/types-page.component';
import { UserCreatePageComponent } from './pages/admin/user-create-page/user-create-page.component';
import { UserEditPageComponent } from './pages/admin/user-edit-page/user-edit-page.component';
import { UsersPageComponent } from './pages/admin/users-page/users-page.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { ProfileEditPageComponent } from './pages/auth/profile-edit-page/profile-edit-page.component';
import { ProfilePageComponent } from './pages/auth/profile-page/profile-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { FavoritesPageComponent } from './pages/favorites-page/favorites-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { ProductCatalogPageComponent } from './pages/product-catalog-page/product-catalog-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { SuccessPageComponent } from './pages/success-page/success-page.component';
import { EmptyStateTestComponent } from './pages/test-pages/empty-state-test/empty-state-test.component';
import { ImageUploadTestComponent } from './pages/test-pages/image-upload-test/image-upload-test.component';
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
      {
        path: 'checkout',
        component: CheckoutPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'payment',
        component: PaymentPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'success',
        component: SuccessPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'favorites',
        component: FavoritesPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'profile/edit',
        component: ProfileEditPageComponent,
        canActivate: [authGuard],
      },
    ],
  },

  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'products', component: ProductsPageComponent },
      { path: 'products/create', component: ProductCreatePageComponent },
      { path: 'products/edit/:id', component: ProductEditPageComponent },
      {
        path: 'products/upload-image/:id',
        component: ProductImageUploadPageComponent,
      },
      { path: 'brands', component: BrandsPageComponent },
      { path: 'brands/create', component: BrandCreatePageComponent },
      { path: 'brands/edit/:id', component: BrandEditPageComponent },
      { path: 'types', component: TypesPageComponent },
      { path: 'types/create', component: TypeCreatePageComponent },
      { path: 'types/edit/:id', component: TypeEditPageComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'users/create', component: UserCreatePageComponent },
      { path: 'users/edit/:id', component: UserEditPageComponent },
      { path: 'orders', component: OrdersPageComponent },
      { path: 'modal', component: ModalTestComponent },
      { path: 'empty-state', component: EmptyStateTestComponent },
      { path: 'image-upload-test', component: ImageUploadTestComponent },
      { path: 'settings', component: SettingsPageComponent },
    ],
  },
];
