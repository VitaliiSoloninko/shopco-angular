import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import {
  LOGIN_URL,
  LOGOUT_URL,
  PROFILE_URL,
  REFRESH_URL,
  REGISTER_URL,
} from '../../../urls';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  RegisterResponse,
  User,
  UserProfile,
} from '../model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenService = inject(TokenService);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(LOGIN_URL, credentials, { withCredentials: true })
      .pipe(
        tap((response) => {
          // Save token in memory
          this.tokenService.setToken(response.access_token);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(userData: RegisterDto): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(REGISTER_URL, userData, { withCredentials: true })
      .pipe(
        tap((response) => {
          // Save token in memory
          this.tokenService.setToken(response.access_token);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  /**
   * Refresh access token using httpOnly refresh token cookie
   * This is called automatically when access token expires (401 response)
   * Or when app initializes to restore session
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        REFRESH_URL,
        {},
        {
          withCredentials: true, // Important: send httpOnly cookie
        }
      )
      .pipe(
        tap((response) => {
          // Save new access token in memory
          this.tokenService.setToken(response.access_token);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((error) => {
          // If refresh fails, clear auth state
          this.clearAuthState();
          throw error;
        })
      );
  }

  logout(): void {
    // Call backend to clear refresh token cookie and database
    this.http
      .post(
        LOGOUT_URL,
        {},
        {
          withCredentials: true, // Important: send httpOnly cookie
        }
      )
      .subscribe({
        next: () => {
          this.clearAuthState();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Logout error:', error);
          // Even if backend fails, clear local state
          this.clearAuthState();
          this.router.navigate(['/login']);
        },
      });
  }

  /**
   * Clear all authentication state
   */
  private clearAuthState(): void {
    this.tokenService.clearToken();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  refreshUserData(): Observable<UserProfile> {
    return this.http.get<User>(PROFILE_URL).pipe(
      map((user) => this.mapUserToProfile(user)),
      tap((userProfile) => {
        this.currentUserSubject.next(userProfile);
      })
    );
  }

  private loadUserProfile(): Observable<UserProfile> {
    return this.http.get<User>(PROFILE_URL).pipe(
      map((user) => this.mapUserToProfile(user)),
      tap((userProfile) => {
        this.currentUserSubject.next(userProfile);
      })
    );
  }

  hasRole(role: 'user' | 'admin'): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Initialize authentication on app start
   * Try to refresh access token using httpOnly cookie
   */
  initializeAuth(): Observable<boolean> {
    // Try to refresh token from httpOnly cookie
    return this.refreshToken().pipe(
      map(() => true),
      catchError(() => {
        // If refresh fails, user needs to login
        this.clearAuthState();
        return of(false);
      })
    );
  }

  private mapUserToProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      street: user.street || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      country: user.country || '',
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
    };
  }
}
