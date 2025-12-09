import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private _accessToken = signal<string | null>(null);
  readonly accessToken = this._accessToken.asReadonly();

  getToken(): string | null {
    return this._accessToken();
  }

  hasToken(): boolean {
    return !!this._accessToken();
  }

  setToken(token: string | null): void {
    this._accessToken.set(token);
  }

  clearToken(): void {
    this._accessToken.set(null);
  }
}
