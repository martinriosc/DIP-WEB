import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.currentUser) {
    return true;
  }

  return authService.checkSession().pipe(
    take(1),
    map(response => {
      if (response.success && response.data) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
}; 