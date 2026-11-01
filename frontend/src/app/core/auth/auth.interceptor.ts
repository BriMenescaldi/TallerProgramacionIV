import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { SesionService } from './sesion.service';

/**
 * Agrega el JWT como `Authorization: Bearer <token>` a cada request. Ante un 401
 * (token ausente, inválido o expirado) cierra la sesión y redirige a /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(SesionService);
  const token = sesion.token();
  const autenticada = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(autenticada).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        sesion.logout();
      }
      return throwError(() => error);
    }),
  );
};
