import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { TurnoService } from '../../../core/api/generated/turno/turno.service';
import {
  type CambioEstadoTurnoDTOEstado,
  type TurnoSalidaDTO,
} from '../../../core/api/generated/model';
import { SesionService } from '../../../core/auth/sesion.service';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';

const ETIQUETA_ESTADO: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  COMPLETADO: 'Completado',
  NO_ASISTIO: 'No asistió',
};

/**
 * #18 — "Mis turnos", compartido por Cliente y Profesional. Filtra por el usuario
 * autenticado según su rol. Cliente puede cancelar; Profesional además confirma,
 * completa o marca no-asistió (botones según el estado actual del turno).
 */
@Component({
  selector: 'app-mis-turnos',
  imports: [DatePipe, MatTableModule, MatButtonModule],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.scss',
})
export class MisTurnos {
  private readonly turnoApi = inject(TurnoService);
  private readonly profesionalApi = inject(ProfesionalService);
  private readonly sesion = inject(SesionService);
  private readonly confirm = inject(ConfirmService);
  private readonly noti = inject(NotificacionService);

  protected readonly esProfesional = this.sesion.rol() === 'PROFESIONAL';
  protected readonly items = signal<TurnoSalidaDTO[]>([]);
  protected readonly columnas = ['fechaHora', 'servicio', 'contraparte', 'estado', 'acciones'];
  private filtro: { clienteId?: number; profesionalId?: number } | null = null;

  constructor() {
    if (this.esProfesional) {
      this.profesionalApi.obtenerMiProfesional().subscribe({
        next: (prof) => {
          if (prof.id != null) {
            this.filtro = { profesionalId: prof.id };
            this.cargar();
          }
        },
        error: (e) => this.noti.error(e, 'No se pudo cargar tu profesional'),
      });
    } else {
      const clienteId = this.sesion.usuario()?.id;
      if (clienteId != null) {
        this.filtro = { clienteId };
        this.cargar();
      }
    }
  }

  protected contraparte(t: TurnoSalidaDTO): string {
    return this.esProfesional ? (t.cliente?.nombre ?? '') : (t.profesional?.usuario?.nombre ?? '');
  }

  protected estado(t: TurnoSalidaDTO): string {
    return t.estado ? (ETIQUETA_ESTADO[t.estado] ?? t.estado) : '';
  }

  protected puedeCancelar(t: TurnoSalidaDTO): boolean {
    return t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO';
  }

  protected puedeConfirmar(t: TurnoSalidaDTO): boolean {
    return this.esProfesional && t.estado === 'PENDIENTE';
  }

  protected puedeCompletar(t: TurnoSalidaDTO): boolean {
    return this.esProfesional && t.estado === 'CONFIRMADO';
  }

  protected puedeNoAsistio(t: TurnoSalidaDTO): boolean {
    return this.esProfesional && t.estado === 'CONFIRMADO';
  }

  protected cancelar(t: TurnoSalidaDTO): void {
    this.confirm
      .confirmar({
        titulo: 'Cancelar turno',
        mensaje: '¿Seguro que querés cancelar este turno?',
        confirmar: 'Cancelar turno',
        cancelar: 'Volver',
      })
      .subscribe((ok) => {
        if (ok) {
          this.cambiar(t, 'CANCELADO');
        }
      });
  }

  protected cambiar(t: TurnoSalidaDTO, estado: CambioEstadoTurnoDTOEstado): void {
    if (t.id == null) {
      return;
    }
    this.turnoApi.cambiarEstadoTurno(t.id, { estado }).subscribe({
      next: () => {
        this.noti.exito('Turno actualizado');
        this.cargar();
      },
      error: (e) => this.noti.error(e, 'No se pudo actualizar el turno'),
    });
  }

  private cargar(): void {
    if (!this.filtro) {
      return;
    }
    this.turnoApi.listarTurnos(this.filtro).subscribe({
      next: (t) => this.items.set(t ?? []),
      error: (e) => this.noti.error(e, 'No se pudieron cargar los turnos'),
    });
  }
}
