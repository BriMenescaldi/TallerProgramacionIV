import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Feedback al usuario vía MatSnackBar. En los errores extrae el `message` del
 * `ErrorDTO` que devuelve el backend; si no hay, usa un texto por defecto.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly snackBar = inject(MatSnackBar);

  exito(mensaje: string): void {
    this.abrir(mensaje);
  }

  error(err: unknown, porDefecto = 'Ocurrió un error'): void {
    this.abrir(this.mensajeDe(err, porDefecto));
  }

  private mensajeDe(err: unknown, porDefecto: string): string {
    const httpError = err as HttpErrorResponse;
    return httpError?.error?.message ?? httpError?.message ?? porDefecto;
  }

  private abrir(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 4000 });
  }
}
