import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../../entities/product/api/product.service';
import { Product } from '../../entities/product/model/product';
import { ProductListComponent } from '../../entities/product/ui/product-list/product-list.component';
import { DressStyleSectionComponent } from './dress-style-section/dress-style-section.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';

@Component({
  selector: 'app-home-page',
  imports: [
    ProductListComponent,
    HeroSectionComponent,
    DressStyleSectionComponent,
    AsyncPipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  newArrivalsCount = 4;
  topRatedCount = 4;

  newProducts$: Observable<Product[]>;
  topRatedProducts$: Observable<Product[]>;

  constructor(private productService: ProductService, private router: Router) {
    this.newProducts$ = this.productService.getNewestProducts(
      this.newArrivalsCount
    );
    this.topRatedProducts$ = this.productService.getTopRatedProducts(
      this.topRatedCount
    );
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  showAllNewArrivals() {
    this.router.navigate(['/catalog'], { queryParams: { sort: 'newest' } });
  }

  showAllTopRated() {
    this.router.navigate(['/catalog'], {
      queryParams: { sort: 'rating-desc' },
    });
  }
}
