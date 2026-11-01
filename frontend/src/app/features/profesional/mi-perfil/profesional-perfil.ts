import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, forkJoin } from 'rxjs';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';

/**
 * Autoedición del perfil del profesional: nombre (PUT /api/usuarios/me) +
 * especialidad/bio/teléfono (PUT /api/profesionales/me). Precarga desde
 * GET /api/profesionales/me.
 */
@Component({
  selector: 'app-profesional-perfil',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="perfil">
      <h1>Mi perfil</h1>
      @if (cargando()) {
        <div class="cargando"><mat-spinner diameter="40" /></div>
      } @else {
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title>Datos personales y profesionales</mat-card-title>
          </mat-card-header>
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
              <mat-form-field>
                <mat-label>Especialidad</mat-label>
                <input matInput formControlName="especialidad" />
                @if (form.controls.especialidad.hasError('required')) {
                  <mat-error>La especialidad es obligatoria</mat-error>
                }
                @if (form.controls.especialidad.hasError('maxlength')) {
                  <mat-error>Máximo 100 caracteres</mat-error>
                }
              </mat-form-field>
              <mat-form-field>
                <mat-label>Biografía</mat-label>
                <textarea matInput formControlName="bio" rows="4"></textarea>
              </mat-form-field>
              <mat-form-field>
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono" />
                @if (form.controls.telefono.hasError('maxlength')) {
                  <mat-error>Máximo 20 caracteres</mat-error>
                }
              </mat-form-field>
              <div class="acciones">
                <button mat-raised-button color="primary" [disabled]="guardando()">Guardar</button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .perfil {
      max-width: 520px;
    }
    mat-card {
      margin-top: 1rem;
    }
    .cargando {
      display: flex;
      justify-content: center;
      padding: 2rem;
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
export class ProfesionalPerfil {
  private readonly profesionalApi = inject(ProfesionalService);
  private readonly usuarioApi = inject(UsuarioService);
  private readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder);
  private readonly noti = inject(NotificacionService);

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    especialidad: ['', [Validators.required, Validators.maxLength(100)]],
    bio: [''],
    telefono: ['', [Validators.maxLength(20)]],
  });

  constructor() {
    this.profesionalApi
      .obtenerMiProfesional()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (prof) =>
          this.form.patchValue({
            nombre: prof.usuario?.nombre ?? '',
            especialidad: prof.especialidad ?? '',
            bio: prof.bio ?? '',
            telefono: prof.telefono ?? '',
          }),
        error: (e) => {
          this.form.patchValue({ nombre: this.sesion.usuario()?.nombre ?? '' });
          this.noti.error(e, 'No se pudieron cargar tus datos');
        },
      });
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.guardando.set(true);
    forkJoin({
      usuario: this.usuarioApi.actualizarMiPerfil({ nombre: v.nombre }),
      profesional: this.profesionalApi.actualizarMiProfesional({
        especialidad: v.especialidad,
        bio: v.bio,
        telefono: v.telefono,
      }),
    })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: ({ usuario }) => {
          this.sesion.guardarUsuario(usuario);
          this.noti.exito('Perfil actualizado');
        },
        error: (e) => this.noti.error(e, 'No se pudo actualizar el perfil'),
      });
  }
}
