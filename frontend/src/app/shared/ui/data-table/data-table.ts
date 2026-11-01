import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  value?: (item: T) => string | number | boolean | null | undefined;
}

@Component({
  selector: 'app-data-table',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable<T> {
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly data = input.required<readonly T[]>();
  readonly emptyMessage = input('No hay registros.');

  readonly editar = output<T>();
  readonly eliminar = output<T>();

  protected readonly columnasMostradas = computed(() => [
    ...this.columns().map((c) => c.key),
    'acciones',
  ]);

  protected celda(item: T, col: DataTableColumn<T>): string {
    const valor = col.value ? col.value(item) : (item as Record<string, unknown>)[col.key];
    return valor == null ? '' : String(valor);
  }
}
