import { Component } from '@angular/core';
import { ProductsCatalogComponent } from '../../widgets/product/products-catalog/products-catalog.component';

@Component({
  selector: 'app-catalog-page',
  imports: [ProductsCatalogComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
})
export class CatalogPageComponent {}
