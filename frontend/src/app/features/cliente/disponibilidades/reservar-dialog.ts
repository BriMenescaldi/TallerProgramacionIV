import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ServicioService } from '../../../core/api/generated/servicio/servicio.service';
import type { DisponibilidadSalidaDTO, ServicioSalidaDTO } from '../../../core/api/generated/model';
import { esDiaDeFranja } from '../../../shared/util/franja';

/** Lo que el diálogo devuelve al cerrarse con una reserva confirmada. */
export interface ReservaResultado {
  servicioId: number;
  fecha: Date;
}

/**
 * #18 — Diálogo de reserva para una franja. El cliente elige servicio y un día
 * concreto (datepicker limitado a 30 días y filtrado al día de la franja). La
 * hora la fija el llamador con la horaInicio de la franja.
 */
@Component({
  selector: 'app-reservar-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './reservar-dialog.html',
  styles: `
    .franja {
      color: var(--mat-sys-on-surface-variant);
      margin: 0 0 1rem;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 320px;
    }
    mat-form-field {
      width: 100%;
    }
    .hora-info {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
      margin: 0;
    }
  `,
})
export class ReservarDialog {
  protected readonly data = inject<DisponibilidadSalidaDTO>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<ReservarDialog, ReservaResultado>>(MatDialogRef);
  private readonly servicioApi = inject(ServicioService);
  private readonly fb = inject(FormBuilder);

  protected readonly servicios = signal<ServicioSalidaDTO[]>([]);
  protected readonly min = new Date();
  protected readonly max = ((d: Date) => {
    d.setDate(d.getDate() + 30);
    return d;
  })(new Date());

  protected readonly form = this.fb.group({
    servicioId: this.fb.control<number | null>(null, Validators.required),
    fecha: this.fb.control<Date | null>(null, Validators.required),
  });

  /** Solo habilita en el datepicker los días que caen en el día de la franja. */
  protected readonly filtroDia = (d: Date | null): boolean =>
    d != null && this.data.diaSemana != null && esDiaDeFranja(d, this.data.diaSemana);

  constructor() {
    this.servicioApi.listarServicios().subscribe((s) => this.servicios.set(s ?? []));
  }

  protected confirmar(): void {
    const { servicioId, fecha } = this.form.getRawValue();
    if (servicioId == null || fecha == null) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close({ servicioId, fecha });
  }

  protected hora(valor: string | undefined): string {
    return valor ? valor.slice(0, 5) : '';
  }

  protected dia(valor: string | undefined): string {
    return valor ? valor.charAt(0) + valor.slice(1).toLowerCase() : '';
  }
}
