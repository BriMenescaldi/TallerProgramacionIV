import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { TurnoService } from '../../../core/api/generated/turno/turno.service';
import { SesionService } from '../../../core/auth/sesion.service';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { MisTurnos } from './mis-turnos';

describe('MisTurnos', () => {
  let turnoApi: {
    listarTurnos: ReturnType<typeof vi.fn>;
    cambiarEstadoTurno: ReturnType<typeof vi.fn>;
  };
  let profesionalApi: { obtenerMiProfesional: ReturnType<typeof vi.fn> };
  let sesion: { rol: ReturnType<typeof vi.fn>; usuario: ReturnType<typeof vi.fn> };
  let confirm: { confirmar: ReturnType<typeof vi.fn> };
  let noti: { exito: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  function crear(): MisTurnos {
    return TestBed.createComponent(MisTurnos).componentInstance;
  }

  beforeEach(async () => {
    turnoApi = {
      listarTurnos: vi.fn().mockReturnValue(of([])),
      cambiarEstadoTurno: vi.fn().mockReturnValue(of({})),
    };
    profesionalApi = { obtenerMiProfesional: vi.fn().mockReturnValue(of({ id: 7 })) };
    sesion = {
      rol: vi.fn().mockReturnValue('CLIENTE'),
      usuario: vi.fn().mockReturnValue({ id: 5 }),
    };
    confirm = { confirmar: vi.fn().mockReturnValue(of(true)) };
    noti = { exito: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [MisTurnos],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TurnoService, useValue: turnoApi },
        { provide: ProfesionalService, useValue: profesionalApi },
        { provide: SesionService, useValue: sesion },
        { provide: ConfirmService, useValue: confirm },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('cliente: lista sus turnos por clienteId', () => {
    crear();
    expect(turnoApi.listarTurnos).toHaveBeenCalledWith({ clienteId: 5 });
  });

  it('profesional: lista sus turnos por profesionalId (vía /me)', () => {
    sesion.rol.mockReturnValue('PROFESIONAL');
    crear();
    expect(turnoApi.listarTurnos).toHaveBeenCalledWith({ profesionalId: 7 });
  });

  it('cancelar confirma y cambia el estado a CANCELADO', () => {
    const cmp = crear() as any;
    cmp.cancelar({ id: 3, estado: 'PENDIENTE' });
    expect(turnoApi.cambiarEstadoTurno).toHaveBeenCalledWith(3, { estado: 'CANCELADO' });
    expect(noti.exito).toHaveBeenCalled();
  });

  it('no cancela si no se confirma', () => {
    confirm.confirmar.mockReturnValue(of(false));
    const cmp = crear() as any;
    cmp.cancelar({ id: 3, estado: 'PENDIENTE' });
    expect(turnoApi.cambiarEstadoTurno).not.toHaveBeenCalled();
  });

  it('solo el profesional puede confirmar un turno pendiente', () => {
    sesion.rol.mockReturnValue('PROFESIONAL');
    const prof = crear() as any;
    expect(prof.puedeConfirmar({ estado: 'PENDIENTE' })).toBe(true);
    expect(prof.puedeConfirmar({ estado: 'CONFIRMADO' })).toBe(false);
  });

  it('el cliente no ve acciones de gestión de estado', () => {
    const cliente = crear() as any;
    expect(cliente.puedeConfirmar({ estado: 'PENDIENTE' })).toBe(false);
    expect(cliente.puedeCompletar({ estado: 'CONFIRMADO' })).toBe(false);
    expect(cliente.puedeCancelar({ estado: 'PENDIENTE' })).toBe(true);
  });
});
