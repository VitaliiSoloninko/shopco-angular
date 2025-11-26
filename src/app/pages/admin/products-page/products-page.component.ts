import { Component, signal } from '@angular/core';
import { PRODUCTS_DATA } from '../../../data/products.data';
import { AdminEntity } from '../../../shared/models/admin-entity.model';

import { AdminEntityListComponent } from '../../../shared/ui/admin-entity-list/admin-entity-list.component';
import { GrayLineComponent } from '../../../shared/ui/gray-line/gray-line.component';

@Component({
  selector: 'app-products-page',
  imports: [GrayLineComponent, AdminEntityListComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent {
  products = signal<AdminEntity[]>(
    PRODUCTS_DATA.rows.map((product) => ({
      ...product,
    }))
  );

  onEditProduct(product: AdminEntity) {
    console.log('Edit product:', product);
  }

  onDeleteProduct(productId: number) {
    this.products.update((products) =>
      products.filter((product) => product.id !== productId)
    );
    console.log('Delete product with id:', productId);
  }

  onAddProduct() {
    console.log('Add new product');
  }
}
