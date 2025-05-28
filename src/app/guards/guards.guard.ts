import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChild, Router  } from '@angular/router';
import { AuthStateService } from '../shared/data-access/auth/state.service';
import { map } from 'rxjs';



export const privateGuard= (): CanActivateFn => {
  return () =>{
    const router = inject(Router);
    const authState = inject(AuthStateService);
    return authState.authState$.pipe(
      map(state => {
        console.log(state)
        if(!state){
          router.navigateByUrl('/login')
          return false
        }else{
          return true
        }
      }) 
    );
  };
};

export const publicGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authState = inject(AuthStateService);
    return authState.authState$.pipe(
      map((state) => {
        console.log(state); // <- ahora no debería spamear "null"
        if (state) {
          // Si el usuario ya está logueado, redirige al dashboard
          router.navigateByUrl('/dashboard');
          return false;
        } else {
          // Si NO hay sesión, permite acceder (por ejemplo, a /login)
          return true;
        }
      })
    );
  };
};
