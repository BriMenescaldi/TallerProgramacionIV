import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { DisponibilidadService } from '../../../core/api/generated/disponibilidad/disponibilidad.service';
import { TurnoService } from '../../../core/api/generated/turno/turno.service';
import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { ClienteDisponibilidades } from './disponibilidades';

describe('ClienteDisponibilidades', () => {
  let api: { listarDisponibilidades: ReturnType<typeof vi.fn> };
  let turnoApi: { crearTurno: ReturnType<typeof vi.fn> };
  let sesion: { usuario: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };
  let noti: { exito: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  function crear(): ClienteDisponibilidades {
    return TestBed.createComponent(ClienteDisponibilidades).componentInstance;
  }

  function dialogDevuelve(res: unknown): void {
    dialog.open.mockReturnValue({ afterClosed: () => of(res) });
  }

  const franja = { profesional: { id: 9 }, horaInicio: '09:00:00', diaSemana: 'MARTES' } as any;

  beforeEach(async () => {
    api = { listarDisponibilidades: vi.fn().mockReturnValue(of([])) };
    turnoApi = { crearTurno: vi.fn().mockReturnValue(of({})) };
    sesion = { usuario: vi.fn().mockReturnValue({ id: 5 }) };
    dialog = { open: vi.fn() };
    noti = { exito: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ClienteDisponibilidades],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DisponibilidadService, useValue: api },
        { provide: TurnoService, useValue: turnoApi },
        { provide: SesionService, useValue: sesion },
        { provide: MatDialog, useValue: dialog },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('lista todas las disponibilidades al iniciar', () => {
    crear();
    expect(api.listarDisponibilidades).toHaveBeenCalled();
  });

  it('reserva componiendo fechaHora con la horaInicio de la franja', () => {
    // 2026-07-21 es martes
    dialogDevuelve({ servicioId: 2, fecha: new Date(2026, 6, 21) });
    const cmp = crear() as any;
    cmp.reservar(franja);
    expect(turnoApi.crearTurno).toHaveBeenCalledWith({
      servicioId: 2,
      profesionalId: 9,
      clienteId: 5,
      fechaHora: '2026-07-21T09:00:00',
    });
    expect(noti.exito).toHaveBeenCalled();
  });

  it('no reserva si se cancela el diálogo', () => {
    dialogDevuelve(undefined);
    const cmp = crear() as any;
    cmp.reservar(franja);
    expect(turnoApi.crearTurno).not.toHaveBeenCalled();
  });
});
