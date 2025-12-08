export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface AdminCreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

export interface AdminUpdateUserDto {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  role: 'user' | 'admin';
  isActive: boolean;
  fullName: string; // computed property
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
