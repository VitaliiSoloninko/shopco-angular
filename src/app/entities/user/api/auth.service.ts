import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { REGISTER_URL } from '../../../urls';
import { RegisterDto, RegisterResponse } from '../model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(userData: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(REGISTER_URL, userData);
  }

  // TODO: Implement authentication methods step by step:
  // - login(credentials: LoginDto): Observable<AuthResponse>
  // - logout(): void
  // - isAuthenticated(): boolean
  // - getCurrentUser(): UserProfile | null
  // - getToken(): string | null
  // - refreshUserData(): Observable<UserProfile>
  // - hasRole(role: 'user' | 'admin'): boolean
  // - isAdmin(): boolean
}
