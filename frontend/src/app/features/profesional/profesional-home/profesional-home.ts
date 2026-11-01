import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { TurnoService } from '../../../core/api/generated/turno/turno.service';
import type { TurnoSalidaDTO } from '../../../core/api/generated/model';
import { SesionService } from '../../../core/auth/sesion.service';
import { proximoTurno } from '../../../shared/util/proximo-turno';

/** Home del profesional: saludo, próximo turno y accesos directos. */
@Component({
  selector: 'app-profesional-home',
  imports: [RouterLink, DatePipe, MatCardModule, MatIconModule],
  template: `
    <h1>Hola, {{ usuario()?.nombre }}</h1>

    <mat-card appearance="outlined" class="proximo">
      <mat-card-header><mat-card-title>Próximo turno</mat-card-title></mat-card-header>
      <mat-card-content>
        @if (proximo(); as t) {
          <p class="fecha">{{ t.fechaHora | date: 'EEEE d/M/yy HH:mm' }}</p>
          <p>{{ t.servicio?.nombre }} · {{ t.cliente?.nombre }}</p>
        } @else {
          <p class="vacio">No tenés turnos próximos.</p>
        }
      </mat-card-content>
    </mat-card>

    <div class="accesos">
      <a mat-card routerLink="/inicio/profesional/mis-turnos" class="acceso">
        <mat-icon>event</mat-icon><span>Mis turnos</span>
      </a>
      <a mat-card routerLink="/inicio/profesional/crear-disponibilidad" class="acceso">
        <mat-icon>schedule</mat-icon><span>Crear disponibilidad</span>
      </a>
      <a mat-card routerLink="/inicio/profesional/mi-perfil" class="acceso">
        <mat-icon>person</mat-icon><span>Mi perfil</span>
      </a>
    </div>
  `,
  styles: `
    .proximo {
      max-width: 460px;
      margin: 1rem 0 1.5rem;
    }
    .fecha {
      font-size: 1.2rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .vacio {
      color: var(--mat-sys-on-surface-variant);
    }
    .accesos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
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
export class ProfesionalHome {
  private readonly profesionalApi = inject(ProfesionalService);
  private readonly turnoApi = inject(TurnoService);

  protected readonly usuario = inject(SesionService).usuario;
  protected readonly proximo = signal<TurnoSalidaDTO | null>(null);

  constructor() {
    this.profesionalApi.obtenerMiProfesional().subscribe((prof) => {
      if (prof?.id == null) {
        return;
      }
      this.turnoApi
        .listarTurnos({ profesionalId: prof.id })
        .subscribe((turnos) => this.proximo.set(proximoTurno(turnos ?? [])));
    });
  }
}
