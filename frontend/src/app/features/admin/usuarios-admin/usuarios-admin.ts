import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';

import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import {
  UsuarioEntradaDTORol,
  type UsuarioEntradaDTO,
  type UsuarioSalidaDTO,
} from '../../../core/api/generated/model';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';
import { DataTable, DataTableColumn } from '../../../shared/ui/data-table/data-table';
import { NotificacionService } from '../../../shared/ui/notificacion.service';

/**
 * ABM de usuarios (solo ADMIN). No hay alta (los clientes se registran, los profesionales se crean
 * en su ABM). Solo edición y baja lógica (DELETE → activo = false en el backend).
 */
@Component({
  selector: 'app-usuarios-admin',
  imports: [
    ReactiveFormsModule,
    DataTable,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './usuarios-admin.html',
  styleUrl: '../admin-modulo.scss',
})
export class UsuariosAdmin {
  private readonly api = inject(UsuarioService);
  private readonly fb = inject(FormBuilder);
  private readonly confirm = inject(ConfirmService);
  private readonly noti = inject(NotificacionService);

  protected readonly roles = Object.values(UsuarioEntradaDTORol);
  protected readonly items = signal<UsuarioSalidaDTO[]>([]);
  protected readonly cargando = signal(false);
  protected readonly mostrarForm = signal(false);
  private editandoId: number | null = null;

  protected readonly columnas: DataTableColumn<UsuarioSalidaDTO>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { key: 'activo', label: 'Activo', value: (u) => (u.activo ? 'Sí' : 'No') },
  ];

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    rol: this.fb.nonNullable.control<UsuarioEntradaDTORol>(
      UsuarioEntradaDTORol.CLIENTE,
      Validators.required,
    ),
    activo: [true],
  });

  constructor() {
    this.cargar();
  }

  protected editar(item: UsuarioSalidaDTO): void {
    this.editandoId = item.id ?? null;
    this.form.reset({
      nombre: item.nombre ?? '',
      email: item.email ?? '',
      rol: item.rol ?? UsuarioEntradaDTORol.CLIENTE,
      activo: item.activo ?? true,
    });
    this.mostrarForm.set(true);
  }

  protected guardar(): void {
    if (this.editandoId == null || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: UsuarioEntradaDTO = this.form.getRawValue();
    this.cargando.set(true);
    this.api
      .actualizarUsuario(this.editandoId, payload)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: () => {
          this.noti.exito('Usuario actualizado');
          this.mostrarForm.set(false);
          this.cargar();
        },
        error: (e) => this.noti.error(e, 'No se pudo actualizar el usuario'),
      });
  }

  protected eliminar(item: UsuarioSalidaDTO): void {
    if (item.id == null) {
      return;
    }
    this.confirm
      .confirmar({
        titulo: 'Dar de baja',
        mensaje: `¿Dar de baja a "${item.nombre}"? Quedará inactivo.`,
        confirmar: 'Dar de baja',
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.eliminarUsuario(item.id!).subscribe({
          next: () => {
            this.noti.exito('Usuario dado de baja');
            this.cargar();
          },
          error: (e) => this.noti.error(e, 'No se pudo dar de baja el usuario'),
        });
      });
  }

  protected cancelar(): void {
    this.mostrarForm.set(false);
  }

  private cargar(): void {
    this.cargando.set(true);
    this.api
      .listarUsuarios()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (d) => this.items.set(d ?? []),
        error: (e) => this.noti.error(e, 'No se pudieron cargar los usuarios'),
      });
  }
}
