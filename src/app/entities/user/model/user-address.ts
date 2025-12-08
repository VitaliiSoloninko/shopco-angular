import { User } from './user.model';

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function extractAddressFromUser(user: User): UserAddress {
  return {
    street: user.street || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
    country: user.country || '',
  };
}
