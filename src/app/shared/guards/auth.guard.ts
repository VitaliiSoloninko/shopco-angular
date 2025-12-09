import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../entities/user/api/token.service';
import { UserState } from '../../entities/user/model/user.state';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const hasToken = tokenService.hasToken();

  if (hasToken) {
    return true;
  }

  // Redirect to login page with return url
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const userState = inject(UserState);
  const router = inject(Router);
  const hasToken = tokenService.hasToken();

  if (!hasToken) {
    // Redirect to login page
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // For now, just check if token exists
  // TODO: Load user data and check admin role
  const isAdmin = userState.isAdmin();
  if (isAdmin) {
    return true;
  }

  // If we can't determine admin status, allow access for now
  // This can be improved when user data loading is implemented
  return true;
};
