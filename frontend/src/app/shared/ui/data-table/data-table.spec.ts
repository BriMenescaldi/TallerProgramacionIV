import { TestBed } from '@angular/core/testing';

import { DataTable, DataTableColumn } from './data-table';

interface Fila {
  nombre: string;
  precio: number;
}

describe('DataTable', () => {
  const columnas: DataTableColumn<Fila>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'precio', label: 'Precio', value: (f) => `$${f.precio}` },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DataTable] }).compileComponents();
  });

  it('renderiza encabezados y filas con MatTable', async () => {
    const fixture = TestBed.createComponent(DataTable<Fila>);
    fixture.componentRef.setInput('columns', columnas);
    fixture.componentRef.setInput('data', [{ nombre: 'Corte', precio: 1500 }]);
    await fixture.whenStable();

    const html = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(html).toContain('Nombre');
    expect(html).toContain('Corte');
    expect(html).toContain('$1500');
  });

  it('muestra el mensaje vacío sin datos', async () => {
    const fixture = TestBed.createComponent(DataTable<Fila>);
    fixture.componentRef.setInput('columns', columnas);
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('emptyMessage', 'Sin registros');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Sin registros');
  });
});
