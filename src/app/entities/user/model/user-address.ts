import { User } from './user.model';

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export function extractAddressFromUser(user: User): UserAddress {
  return {
    street: user.street || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
    country: user.country || '',
    phone: user.phone || '',
  };
}
