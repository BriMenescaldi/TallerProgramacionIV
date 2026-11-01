import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import type { UsuarioSalidaDTORol } from '../api/generated/model';
import { SesionService } from './sesion.service';

/** Exige sesión iniciada; si no, redirige a /login. */
export const authGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  return sesion.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

/** Solo para usuarios sin sesión (ej. /login); si ya hay sesión, redirige a /inicio. */
export const guestGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  return sesion.isLoggedIn() ? router.createUrlTree(['/inicio']) : true;
};

/** Exige un rol concreto; si no coincide, redirige a /inicio (que reenvía al home correcto). */
export function roleGuard(rol: UsuarioSalidaDTORol): CanActivateFn {
  return () => {
    const sesion = inject(SesionService);
    const router = inject(Router);
    return sesion.rol() === rol ? true : router.createUrlTree(['/inicio']);
  };
}

/** /inicio: reenvía al home del rol (/inicio/{rol}); sin sesión, a /login. */
export const inicioRedirectGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  const rol = sesion.rol();
  if (!sesion.isLoggedIn() || !rol) {
    return router.createUrlTree(['/login']);
  }
  return router.createUrlTree(['/inicio', rol.toLowerCase()]);
};
