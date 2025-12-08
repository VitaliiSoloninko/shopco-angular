import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { LOGIN_URL, PROFILE_URL, REGISTER_URL } from '../../../urls';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  RegisterResponse,
  User,
  UserProfile,
} from '../model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(
    this.getCurrentUserFromStorage()
  );

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(LOGIN_URL, credentials).pipe(
      tap((response) => {
        this.setAuthData(response);
      })
    );
  }

  register(userData: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(REGISTER_URL, userData);
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  refreshUserData(): Observable<UserProfile> {
    return this.http.get<User>(PROFILE_URL).pipe(
      map((user) => this.mapUserToProfile(user)),
      tap((userProfile) => {
        this.currentUserSubject.next(userProfile);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userProfile));
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

  initializeAuth(): Observable<boolean> {
    if (!this.hasToken()) {
      return of(false);
    }

    return this.refreshUserData().pipe(
      map(() => true),
      tap(() => this.isAuthenticatedSubject.next(true))
    );
  }

  private setAuthData(authResponse: AuthResponse): void {
    const userProfile = this.mapUserToProfile(authResponse.user);

    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userProfile));

    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(userProfile);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private getCurrentUserFromStorage(): UserProfile | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private mapUserToProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      street: user.street,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
      role: user.role,
      isActive: user.isActive,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
    };
  }
}
