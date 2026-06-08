import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (authService.isAdmin() && !state.url.startsWith('/admin')) {
      return router.createUrlTree(['/admin']);
    }
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
