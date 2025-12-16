import { Component, input } from '@angular/core';
import { StarRatingComponent } from '../../../../shared/ui/star-rating/star-rating.component';
import { IMAGES_BASE_URL } from '../../../../urls';
import { Product } from '../../model/product';

@Component({
  selector: 'app-product-card',
  imports: [StarRatingComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input<Product>({} as Product);

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    // If image path already includes http/https, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend base URL
    return IMAGES_BASE_URL + imagePath;
  }
}
