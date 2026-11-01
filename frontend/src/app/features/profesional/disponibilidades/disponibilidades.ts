import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';

import { DisponibilidadService } from '../../../core/api/generated/disponibilidad/disponibilidad.service';
import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import {
  DisponibilidadEntradaDTODiaSemana,
  type DisponibilidadSalidaDTO,
} from '../../../core/api/generated/model';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';

/**
 * #17 — El profesional gestiona sus franjas semanales: alta (día + hora inicio/fin),
 * listado de las propias y borrado. Sin calendario. El profesionalId sale de /me.
 */
@Component({
  selector: 'app-profesional-disponibilidades',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './disponibilidades.html',
  styleUrl: './disponibilidades.scss',
})
export class ProfesionalDisponibilidades {
  private readonly api = inject(DisponibilidadService);
  private readonly profesionalApi = inject(ProfesionalService);
  private readonly fb = inject(FormBuilder);
  private readonly confirm = inject(ConfirmService);
  private readonly noti = inject(NotificacionService);

  protected readonly dias = Object.values(DisponibilidadEntradaDTODiaSemana);
  protected readonly columnas = ['diaSemana', 'horaInicio', 'horaFin', 'acciones'];
  protected readonly items = signal<DisponibilidadSalidaDTO[]>([]);
  protected readonly guardando = signal(false);
  private profesionalId: number | null = null;

  protected readonly form = this.fb.nonNullable.group({
    diaSemana: this.fb.nonNullable.control<DisponibilidadEntradaDTODiaSemana>(
      DisponibilidadEntradaDTODiaSemana.LUNES,
      Validators.required,
    ),
    horaInicio: ['09:00', Validators.required],
    horaFin: ['17:00', Validators.required],
  });

  constructor() {
    this.profesionalApi.obtenerMiProfesional().subscribe({
      next: (prof) => {
        this.profesionalId = prof.id ?? null;
        this.cargar();
      },
      error: (e) => this.noti.error(e, 'No se pudo cargar tu profesional'),
    });
  }

  protected crear(): void {
    if (this.form.invalid || this.profesionalId == null) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (v.horaFin <= v.horaInicio) {
      this.noti.error(null, 'La hora de fin debe ser posterior a la de inicio');
      return;
    }
    this.guardando.set(true);
    this.api
      .crearDisponibilidad({ profesionalId: this.profesionalId, ...v })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          this.noti.exito('Franja agregada');
          this.cargar();
        },
        error: (e) => this.noti.error(e, 'No se pudo agregar la franja'),
      });
  }

  protected borrar(disp: DisponibilidadSalidaDTO): void {
    if (disp.id == null) {
      return;
    }
    this.confirm
      .confirmar({
        titulo: 'Borrar franja',
        mensaje: `¿Borrar la franja del ${disp.diaSemana} de ${this.hora(disp.horaInicio)} a ${this.hora(disp.horaFin)}?`,
        confirmar: 'Borrar',
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.eliminarDisponibilidad(disp.id!).subscribe({
          next: () => {
            this.noti.exito('Franja borrada');
            this.cargar();
          },
          error: (e) => this.noti.error(e, 'No se pudo borrar la franja'),
        });
      });
  }

  protected hora(valor: string | undefined): string {
    return valor ? valor.slice(0, 5) : '';
  }

  protected dia(valor: string | undefined): string {
    return valor ? valor.charAt(0) + valor.slice(1).toLowerCase() : '';
  }

  private cargar(): void {
    if (this.profesionalId == null) {
      return;
    }
    this.api.listarDisponibilidades({ profesionalId: this.profesionalId }).subscribe({
      next: (d) => this.items.set(d ?? []),
      error: (e) => this.noti.error(e, 'No se pudieron cargar las franjas'),
    });
  }
}
