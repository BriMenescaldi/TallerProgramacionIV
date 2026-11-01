import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

import { DisponibilidadService } from '../../../core/api/generated/disponibilidad/disponibilidad.service';
import { TurnoService } from '../../../core/api/generated/turno/turno.service';
import type { DisponibilidadSalidaDTO } from '../../../core/api/generated/model';
import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { combinarFechaHora } from '../../../shared/util/franja';
import { ReservarDialog, type ReservaResultado } from './reservar-dialog';

/**
 * #18 — El cliente ve todas las franjas ofrecidas y reserva un turno sobre una de
 * ellas (diálogo de confirmación con servicio + fecha). La hora del turno se toma
 * de la horaInicio de la franja.
 */
@Component({
  selector: 'app-cliente-disponibilidades',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './disponibilidades.html',
  styleUrl: './disponibilidades.scss',
})
export class ClienteDisponibilidades {
  private readonly api = inject(DisponibilidadService);
  private readonly turnoApi = inject(TurnoService);
  private readonly sesion = inject(SesionService);
  private readonly dialog = inject(MatDialog);
  private readonly noti = inject(NotificacionService);

  protected readonly columnas = ['profesional', 'diaSemana', 'horario', 'acciones'];
  protected readonly items = signal<DisponibilidadSalidaDTO[]>([]);

  constructor() {
    this.api.listarDisponibilidades().subscribe({
      next: (d) => this.items.set(d ?? []),
      error: (e) => this.noti.error(e, 'No se pudieron cargar las disponibilidades'),
    });
  }

  protected reservar(disp: DisponibilidadSalidaDTO): void {
    this.dialog
      .open(ReservarDialog, { data: disp, width: '400px' })
      .afterClosed()
      .subscribe((res: ReservaResultado | undefined) => {
        if (!res) {
          return;
        }
        const clienteId = this.sesion.usuario()?.id;
        if (clienteId == null || disp.profesional?.id == null || disp.horaInicio == null) {
          return;
        }
        this.turnoApi
          .crearTurno({
            servicioId: res.servicioId,
            profesionalId: disp.profesional.id,
            clienteId,
            fechaHora: combinarFechaHora(res.fecha, disp.horaInicio),
          })
          .subscribe({
            next: () => this.noti.exito('Turno reservado'),
            error: (e) => this.noti.error(e, 'No se pudo reservar el turno'),
          });
      });
  }

  protected hora(valor: string | undefined): string {
    return valor ? valor.slice(0, 5) : '';
  }

  protected dia(valor: string | undefined): string {
    return valor ? valor.charAt(0) + valor.slice(1).toLowerCase() : '';
  }
}
