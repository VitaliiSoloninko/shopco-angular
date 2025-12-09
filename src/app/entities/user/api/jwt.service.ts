import { Injectable } from '@angular/core';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  firstName: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

      const decoded = atob(paddedBase64);
      return JSON.parse(decoded) as JwtPayload;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  getUserRole(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.role || null;
  }

  isAdmin(token: string): boolean {
    const role = this.getUserRole(token);
    return role === 'admin';
  }
}
