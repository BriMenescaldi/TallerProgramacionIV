import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';

import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';

/** Autoedición del perfil del cliente: solo el nombre (PUT /api/usuarios/me). */
@Component({
  selector: 'app-cliente-perfil',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="perfil">
      <h1>Mi perfil</h1>
      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Datos personales</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="guardar()">
            <mat-form-field>
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" />
              @if (form.controls.nombre.hasError('required')) {
                <mat-error>El nombre es obligatorio</mat-error>
              }
              @if (form.controls.nombre.hasError('maxlength')) {
                <mat-error>Máximo 100 caracteres</mat-error>
              }
            </mat-form-field>
            <div class="acciones">
              <button mat-raised-button color="primary" [disabled]="guardando()">Guardar</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .perfil {
      max-width: 520px;
    }
    mat-card {
      margin-top: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    mat-form-field {
      width: 100%;
    }
    .acciones {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
  `,
})
export class ClientePerfil {
  private readonly usuarioApi = inject(UsuarioService);
  private readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder);
  private readonly noti = inject(NotificacionService);

  protected readonly guardando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor() {
    const nombre = this.sesion.usuario()?.nombre;
    if (nombre) {
      this.form.setValue({ nombre });
    }
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.usuarioApi
      .actualizarMiPerfil(this.form.getRawValue())
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (usuario) => {
          this.sesion.guardarUsuario(usuario);
          this.noti.exito('Perfil actualizado');
        },
        error: (e) => this.noti.error(e, 'No se pudo actualizar el perfil'),
      });
  }
}
