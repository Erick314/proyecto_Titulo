import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { AuthStateService } from '../shared/data-access/auth/state.service';
import { map, take } from 'rxjs';

export const privateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);

  return authState.authState$.pipe(
    take(1), // Solo toma el primer valor para evitar múltiples emisiones
    map((user) => {
      if (user) {
        // Usuario autenticado, permite acceso
        return true;
      } else {
        // Usuario no autenticado, redirige a login
        router.navigateByUrl('/login');
        return false;
      }
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);

  return authState.authState$.pipe(
    take(1), // Solo toma el primer valor para evitar múltiples emisiones
    map((user) => {
      if (user) {
        // Usuario ya autenticado, redirige al dashboard
        router.navigateByUrl('/dashboard');
        return false;
      } else {
        // Usuario no autenticado, permite acceso a páginas públicas
        return true;
      }
    })
  );
};

// Guard para rutas hijas (si necesitas protección adicional)
export const privateChildGuard: CanActivateChildFn = (childRoute, state) => {
  return privateGuard(childRoute, state);
};
