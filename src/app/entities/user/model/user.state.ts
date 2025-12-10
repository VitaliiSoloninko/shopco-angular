import { computed, inject, Injectable, signal } from '@angular/core';
import { USERS } from '../../../data/users.data';
import { AuthService } from '../api/auth.service';
import { TokenService } from '../api/token.service';
import { UserService } from '../api/user.service';
import { UserProfile } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserState {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private tokenService = inject(TokenService);

  // Private signals
  private _currentUser = signal<UserProfile | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly computed signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly accessToken = this.tokenService.accessToken;

  // Computed derived state
  readonly isAuthenticated = computed(
    () => !!this.tokenService.getToken() && !!this._currentUser()
  );
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly fullName = computed(() => {
    const user = this._currentUser();
    return user ? user.fullName : '';
  });

  readonly userInitials = computed(() => {
    const user = this._currentUser();
    if (!user) return '';

    const firstInitial = user.firstName.charAt(0).toUpperCase();
    const lastInitial = user.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  });

  readonly hasAddress = computed(() => {
    const user = this._currentUser();
    return !!(user?.street && user?.city && user?.postalCode && user?.country);
  });

  constructor() {
    // Subscribe to AuthService changes and sync with signals
    this.authService.currentUser$.subscribe((user) => {
      this._currentUser.set(user);
    });

    this.authService.isAuthenticated$.subscribe((isAuth) => {
      if (!isAuth) {
        this._currentUser.set(null);
        this._error.set(null);
      }
    });
  }

  /**
   * Initialize user state (call on app startup)
   */
  async initializeUserState(): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const isInitialized = await this.authService.initializeAuth().toPromise();

      if (isInitialized) {
        await this.refreshUserData();
      }
    } catch (error) {
      this._error.set('Failed to initialize user state');
      console.error('User state initialization error:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Update current user data
   */
  setCurrentUser(user: UserProfile | null): void {
    this._currentUser.set(user);
    this._error.set(null);
  }

  /**
   * Set access token in memory
   */
  setAccessToken(token: string | null): void {
    this.tokenService.setToken(token);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.tokenService.getToken();
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updateData: Partial<UserProfile>): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const updatedUser = await this.userService
        .updateProfile(updateData)
        .toPromise();

      if (updatedUser) {
        this._currentUser.set(updatedUser);
      }
    } catch (error) {
      this._error.set('Failed to update profile');
      console.error('Update profile error:', error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Refresh user data from server
   */
  async refreshUserData(): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      // Check if user is authenticated
      if (!this.tokenService.hasToken()) {
        throw new Error('No authentication token found');
      }

      const user = await this.authService.refreshUserData().toPromise();

      if (user) {
        this._currentUser.set(user);
      } else {
        throw new Error('No user data received from server');
      }
    } catch (error: any) {
      console.error('Refresh user data error:', error);

      // Set more specific error messages
      if (error?.status === 401) {
        this._error.set('Authentication expired. Please log in again.');
      } else if (error?.status === 403) {
        this._error.set('Access denied. Please check your permissions.');
      } else if (error?.status === 0 || !error?.status) {
        this._error.set(
          'Unable to connect to server. Please check your connection.'
        );
      } else if (error?.message === 'No authentication token found') {
        this._error.set('Please log in to view your profile.');
      } else {
        this._error.set('Failed to load profile data. Please try again.');
      }

      // Re-throw error so calling component can handle it if needed
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Clear user state (on logout)
   */
  clearUserState(): void {
    this._currentUser.set(null);
    this._error.set(null);
    this._isLoading.set(false);
    this.tokenService.clearToken();
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  /**
   * Set error state
   */
  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'user' | 'admin'): boolean {
    return this._currentUser()?.role === role;
  }

  /**
   * Get user address as object
   */
  getUserAddress() {
    return computed(() => {
      const user = this._currentUser();
      if (!user) return null;

      return {
        street: user.street,
        city: user.city,
        postalCode: user.postalCode,
        country: user.country,
      };
    });
  }

  /**
   * Get user name as object
   */
  getUserName() {
    return computed(() => {
      const user = this._currentUser();
      if (!user) return null;

      return {
        firstName: user.firstName,
        lastName: user.lastName,
      };
    });
  }

  /**
   * Load first mock user from USERS data (for development/demo)
   */
  loadMockUser(): void {
    if (USERS.length > 0) {
      const mockUser = USERS[0];
      const userProfile: UserProfile = {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        street: mockUser.street,
        city: mockUser.city,
        postalCode: mockUser.postalCode,
        country: mockUser.country,
        role: mockUser.role,
        isActive: mockUser.isActive,
        fullName: `${mockUser.firstName} ${mockUser.lastName}`.trim(),
      };

      this._currentUser.set(userProfile);
      this._error.set(null);
    }
  }
}
