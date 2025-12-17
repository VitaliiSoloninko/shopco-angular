import { Product } from '../../product/model/product';

export interface CartItem {
  id: string | number;
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
  maxQuantity?: number;
  addedAt?: Date | string;
}

export interface CartSummary {
  discount: number;
  discountPercentage?: number;
  deliveryFee: number;
  subtotal: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

// API DTOs
export interface AddToCartDto {
  productId: number;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}
