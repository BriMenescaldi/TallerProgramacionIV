import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';

import { ServicioService } from '../../../core/api/generated/servicio/servicio.service';
import type { ServicioEntradaDTO, ServicioSalidaDTO } from '../../../core/api/generated/model';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';
import { DataTable, DataTableColumn } from '../../../shared/ui/data-table/data-table';
import { NotificacionService } from '../../../shared/ui/notificacion.service';

/** ABM de servicios (solo ADMIN): listado en tabla + form reactivo de alta/edición. */
@Component({
  selector: 'app-servicios-admin',
  imports: [
    ReactiveFormsModule,
    DataTable,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './servicios-admin.html',
  styleUrl: '../admin-modulo.scss',
})
export class ServiciosAdmin {
  private readonly api = inject(ServicioService);
  private readonly fb = inject(FormBuilder);
  private readonly confirm = inject(ConfirmService);
  private readonly noti = inject(NotificacionService);

  protected readonly items = signal<ServicioSalidaDTO[]>([]);
  protected readonly cargando = signal(false);
  protected readonly mostrarForm = signal(false);
  private editandoId: number | null = null;

  protected readonly columnas: DataTableColumn<ServicioSalidaDTO>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'duracionMin', label: 'Duración (min)' },
    { key: 'precio', label: 'Precio', value: (s) => (s.precio != null ? `$${s.precio}` : '') },
  ];

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', Validators.required],
    duracionMin: [30, [Validators.required, Validators.min(1)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    this.cargar();
  }

  protected nuevo(): void {
    this.editandoId = null;
    this.form.reset({ nombre: '', descripcion: '', duracionMin: 30, precio: 0 });
    this.mostrarForm.set(true);
  }

  protected editar(item: ServicioSalidaDTO): void {
    this.editandoId = item.id ?? null;
    this.form.reset({
      nombre: item.nombre ?? '',
      descripcion: item.descripcion ?? '',
      duracionMin: item.duracionMin ?? 30,
      precio: item.precio ?? 0,
    });
    this.mostrarForm.set(true);
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: ServicioEntradaDTO = this.form.getRawValue();
    const peticion =
      this.editandoId != null
        ? this.api.actualizarServicio(this.editandoId, payload)
        : this.api.crearServicio(payload);

    this.cargando.set(true);
    peticion.pipe(finalize(() => this.cargando.set(false))).subscribe({
      next: () => {
        this.noti.exito('Servicio guardado');
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (e) => this.noti.error(e, 'No se pudo guardar el servicio'),
    });
  }

  protected eliminar(item: ServicioSalidaDTO): void {
    if (item.id == null) {
      return;
    }
    this.confirm
      .confirmar({
        titulo: 'Eliminar servicio',
        mensaje: `¿Eliminar "${item.nombre}"?`,
        confirmar: 'Eliminar',
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.eliminarServicio(item.id!).subscribe({
          next: () => {
            this.noti.exito('Servicio eliminado');
            this.cargar();
          },
          error: (e) => this.noti.error(e, 'No se pudo eliminar el servicio'),
        });
      });
  }

  protected cancelar(): void {
    this.mostrarForm.set(false);
  }

  private cargar(): void {
    this.cargando.set(true);
    this.api
      .listarServicios()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (d) => this.items.set(d ?? []),
        error: (e) => this.noti.error(e, 'No se pudieron cargar los servicios'),
      });
  }
}
