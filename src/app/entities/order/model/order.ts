// Order status types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Payment method types
export type PaymentMethod = 'card' | 'cash' | 'paypal';

// Payment status types
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Order item interface
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  selectedSize: string;
  selectedColor: string | null;
  subtotal: number;
}

// Full order interface (response from backend)
export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// DTO for creating order
export interface CreateOrderDto {
  paymentMethod: PaymentMethod;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  notes?: string;
  shippingCost: number;
  tax: number;
}

// DTO for updating order status (admin)
export interface UpdateOrderStatusDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}
