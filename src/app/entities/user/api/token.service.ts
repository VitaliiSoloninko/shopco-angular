import { inject, Injectable, signal } from '@angular/core';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private jwtService = inject(JwtService);
  private _accessToken = signal<string | null>(null);
  readonly accessToken = this._accessToken.asReadonly();

  getToken(): string | null {
    return this._accessToken();
  }

  hasToken(): boolean {
    const token = this._accessToken();
    if (!token) {
      return false;
    }

    if (this.jwtService.isTokenExpired(token)) {
      this.clearToken();
      return false;
    }

    return true;
  }

  setToken(token: string | null): void {
    this._accessToken.set(token);
  }

  clearToken(): void {
    this._accessToken.set(null);
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    return this.jwtService.isAdmin(token);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    return this.jwtService.getUserRole(token);
  }
}
