import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../entities/order/model/order';

// Export types from order entity
export type { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus };

// Sample orders data matching backend API structure
export const ORDERS: Order[] = [
  {
    id: 1,
    userId: 2,
    orderNumber: 'ORD-1766050918857-5544',
    status: 'cancelled',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    totalAmount: 308.49,
    subtotal: 300,
    tax: 2.5,
    shippingCost: 5.99,
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
    street: '123 Main Street',
    city: 'New York',
    postalCode: '10001',
    country: 'USA',
    phone: '+1234567890',
    notes: 'Please leave at the door',
    items: [
      {
        id: 1,
        productId: 22,
        productName: 'Black Striped T-shirt',
        productImage:
          'product-1765819196414-505a8fcf-64ac-4fad-a725-df904498f4d2.jpg',
        quantity: 2,
        price: 150,
        selectedSize: 'Large',
        selectedColor: null,
        subtotal: 300,
      },
    ],
    createdAt: '2025-12-18T09:41:58.858Z',
    updatedAt: '2025-12-19T14:28:25.815Z',
  },
  {
    id: 2,
    userId: 2,
    orderNumber: 'ORD-1766154321728-3875',
    status: 'processing',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    totalAmount: 375.48,
    subtotal: 359.98,
    tax: 5.5,
    shippingCost: 10,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    street: '456 Oak Avenue',
    city: 'Los Angeles',
    postalCode: '90001',
    country: 'USA',
    phone: '+1987654321',
    notes: 'Please deliver after 5 PM',
    items: [
      {
        id: 2,
        productId: 24,
        productName: 'Checkered Shirt',
        productImage:
          'product-1765889761969-5fc89fd4-6e5a-4970-80b4-802b0fec34ac.jpg',
        quantity: 2,
        price: 179.99,
        selectedSize: 'M',
        selectedColor: 'Black',
        subtotal: 359.98,
      },
    ],
    createdAt: '2025-12-19T14:25:21.728Z',
    updatedAt: '2025-12-19T14:27:49.423Z',
  },
];
