import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
    return this.http.post<AuthResponse>(LOGIN_URL, credentials).pipe(
      tap((response) => {
        // Save token in memory
        this.tokenService.setToken(response.access_token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(userData: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(REGISTER_URL, userData).pipe(
      tap((response) => {
        // Save token in memory
        this.tokenService.setToken(response.access_token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
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

  initializeAuth(): Observable<boolean> {
    if (!this.tokenService.hasToken()) {
      return of(false);
    }

    return this.refreshUserData().pipe(
      map(() => true),
      tap(() => this.isAuthenticatedSubject.next(true))
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
