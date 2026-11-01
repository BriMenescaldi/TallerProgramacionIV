import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import {
  UsuarioEntradaDTORol,
  type ProfesionalEntradaDTO,
  type ProfesionalSalidaDTO,
} from '../../../core/api/generated/model';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';
import { DataTable, DataTableColumn } from '../../../shared/ui/data-table/data-table';
import { NotificacionService } from '../../../shared/ui/notificacion.service';

/**
 * ABM de profesionales (solo ADMIN). El alta crea en cascada la cuenta de usuario (con password); en
 * la edición la password no se muestra ni se envía (el backend la ignora).
 */
@Component({
  selector: 'app-profesionales-admin',
  imports: [
    ReactiveFormsModule,
    DataTable,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './profesionales-admin.html',
  styleUrl: '../admin-modulo.scss',
})
export class ProfesionalesAdmin {
  private readonly api = inject(ProfesionalService);
  private readonly fb = inject(FormBuilder);
  private readonly confirm = inject(ConfirmService);
  private readonly noti = inject(NotificacionService);

  protected readonly items = signal<ProfesionalSalidaDTO[]>([]);
  protected readonly cargando = signal(false);
  protected readonly mostrarForm = signal(false);
  protected readonly creando = signal(true);
  private editandoId: number | null = null;

  protected readonly columnas: DataTableColumn<ProfesionalSalidaDTO>[] = [
    { key: 'nombre', label: 'Nombre', value: (p) => p.usuario?.nombre ?? '' },
    { key: 'email', label: 'Email', value: (p) => p.usuario?.email ?? '' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    especialidad: ['', [Validators.required, Validators.maxLength(100)]],
    telefono: [''],
    bio: [''],
  });

  constructor() {
    this.cargar();
  }

  protected nuevo(): void {
    this.editandoId = null;
    this.creando.set(true);
    this.form.reset({
      nombre: '',
      email: '',
      password: '',
      especialidad: '',
      telefono: '',
      bio: '',
    });
    this.form.controls.password.enable();
    this.mostrarForm.set(true);
  }

  protected editar(item: ProfesionalSalidaDTO): void {
    this.editandoId = item.id ?? null;
    this.creando.set(false);
    this.form.reset({
      nombre: item.usuario?.nombre ?? '',
      email: item.usuario?.email ?? '',
      password: '',
      especialidad: item.especialidad ?? '',
      telefono: item.telefono ?? '',
      bio: item.bio ?? '',
    });
    this.form.controls.password.disable();
    this.mostrarForm.set(true);
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: ProfesionalEntradaDTO = {
      usuario: {
        nombre: v.nombre,
        email: v.email,
        rol: UsuarioEntradaDTORol.PROFESIONAL,
        activo: true,
      },
      especialidad: v.especialidad,
      bio: v.bio,
      telefono: v.telefono,
    };

    const peticion =
      this.editandoId != null
        ? this.api.actualizarProfesional(this.editandoId, payload)
        : this.api.crearProfesional({ ...payload, password: v.password });

    this.cargando.set(true);
    peticion.pipe(finalize(() => this.cargando.set(false))).subscribe({
      next: () => {
        this.noti.exito('Profesional guardado');
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (e) => this.noti.error(e, 'No se pudo guardar el profesional'),
    });
  }

  protected eliminar(item: ProfesionalSalidaDTO): void {
    if (item.id == null) {
      return;
    }
    this.confirm
      .confirmar({
        titulo: 'Eliminar profesional',
        mensaje: `¿Eliminar a "${item.usuario?.nombre}"?`,
        confirmar: 'Eliminar',
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.eliminarProfesional(item.id!).subscribe({
          next: () => {
            this.noti.exito('Profesional eliminado');
            this.cargar();
          },
          error: (e) => this.noti.error(e, 'No se pudo eliminar el profesional'),
        });
      });
  }

  protected cancelar(): void {
    this.mostrarForm.set(false);
  }

  private cargar(): void {
    this.cargando.set(true);
    this.api
      .listarProfesionales()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (d) => this.items.set(d ?? []),
        error: (e) => this.noti.error(e, 'No se pudieron cargar los profesionales'),
      });
  }
}
