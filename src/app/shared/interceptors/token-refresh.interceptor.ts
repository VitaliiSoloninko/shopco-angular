import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../entities/user/api/auth.service';
import { LOGOUT_URL, REFRESH_URL } from '../../urls';

/**
 * Token Refresh Interceptor
 *
 * Automatically refreshes access token when receiving 401 Unauthorized
 * Uses httpOnly refresh token cookie from backend
 *
 * Flow:
 * 1. Request fails with 401 (access token expired)
 * 2. Call /api/auth/refresh to get new access token
 * 3. Retry original request with new token
 * 4. If refresh fails, redirect to login
 */
export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 errors
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Don't retry refresh or logout endpoints
      if (isAuthEndpoint(req)) {
        return throwError(() => error);
      }

      console.log('Access token expired, refreshing...');

      // Try to refresh the access token
      return authService.refreshToken().pipe(
        switchMap(() => {
          // Retry the original request with new token
          console.log('Token refreshed successfully, retrying request');
          return next(req);
        }),
        catchError((refreshError) => {
          // Refresh failed, user needs to login again
          console.error('Token refresh failed:', refreshError);
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};

/**
 * Check if request is to an auth endpoint
 */
function isAuthEndpoint(req: HttpRequest<any>): boolean {
  return req.url.includes(REFRESH_URL) || req.url.includes(LOGOUT_URL);
}
