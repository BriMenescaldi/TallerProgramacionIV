import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { ServicioService } from '../../../core/api/generated/servicio/servicio.service';
import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { SesionService } from '../../../core/auth/sesion.service';

/** Home del admin: saludo, contadores (desde los listar) y accesos a los ABMs. */
@Component({
  selector: 'app-admin-home',
  imports: [RouterLink, MatCardModule, MatIconModule],
  template: `
    <h1>Hola, {{ usuario()?.nombre }}</h1>
    <p class="subtitulo">Panel de administración del sistema de turnos.</p>

    <div class="grid">
      <mat-card appearance="outlined">
        <mat-card-content>
          <span class="numero">{{ servicios() ?? '—' }}</span>
          <span class="rotulo">Servicios</span>
        </mat-card-content>
      </mat-card>
      <mat-card appearance="outlined">
        <mat-card-content>
          <span class="numero">{{ profesionales() ?? '—' }}</span>
          <span class="rotulo">Profesionales</span>
        </mat-card-content>
      </mat-card>
      <mat-card appearance="outlined">
        <mat-card-content>
          <span class="numero">{{ usuarios() ?? '—' }}</span>
          <span class="rotulo">Usuarios</span>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="grid accesos">
      <a mat-card routerLink="/inicio/admin/servicios" class="acceso">
        <mat-icon>design_services</mat-icon><span>Gestionar servicios</span>
      </a>
      <a mat-card routerLink="/inicio/admin/profesionales" class="acceso">
        <mat-icon>badge</mat-icon><span>Gestionar profesionales</span>
      </a>
      <a mat-card routerLink="/inicio/admin/usuarios" class="acceso">
        <mat-icon>group</mat-icon><span>Gestionar usuarios</span>
      </a>
    </div>
  `,
  styles: `
    .subtitulo {
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 1.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .accesos {
      margin-top: 1.5rem;
    }
    mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 1rem;
    }
    .numero {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--mat-sys-primary);
    }
    .rotulo {
      color: var(--mat-sys-on-surface-variant);
    }
    .acceso {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      text-decoration: none;
      color: inherit;
      font-weight: 600;
    }
    .acceso mat-icon {
      color: var(--mat-sys-primary);
    }
  `,
})
export class AdminHome {
  private readonly servicioApi = inject(ServicioService);
  private readonly profesionalApi = inject(ProfesionalService);
  private readonly usuarioApi = inject(UsuarioService);

  protected readonly usuario = inject(SesionService).usuario;
  protected readonly servicios = signal<number | null>(null);
  protected readonly profesionales = signal<number | null>(null);
  protected readonly usuarios = signal<number | null>(null);

  constructor() {
    this.servicioApi.listarServicios().subscribe((d) => this.servicios.set(d?.length ?? 0));
    this.profesionalApi
      .listarProfesionales()
      .subscribe((d) => this.profesionales.set(d?.length ?? 0));
    this.usuarioApi.listarUsuarios().subscribe((d) => this.usuarios.set(d?.length ?? 0));
  }
}
