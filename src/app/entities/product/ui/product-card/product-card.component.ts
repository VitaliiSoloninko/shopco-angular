import { Component, input } from '@angular/core';
import { StarRatingComponent } from '../../../../shared/ui/star-rating/star-rating.component';
import { getImageUrl } from '../../../../shared/utils/image.utils';
import { Product } from '../../model/product';

@Component({
  selector: 'app-product-card',
  imports: [StarRatingComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input<Product>({} as Product);

  getImageUrl = getImageUrl;
}
