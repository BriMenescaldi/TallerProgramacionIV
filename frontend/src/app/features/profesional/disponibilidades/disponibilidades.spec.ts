import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DisponibilidadService } from '../../../core/api/generated/disponibilidad/disponibilidad.service';
import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { ProfesionalDisponibilidades } from './disponibilidades';

describe('ProfesionalDisponibilidades', () => {
  let api: {
    crearDisponibilidad: ReturnType<typeof vi.fn>;
    listarDisponibilidades: ReturnType<typeof vi.fn>;
    eliminarDisponibilidad: ReturnType<typeof vi.fn>;
  };
  let profesionalApi: { obtenerMiProfesional: ReturnType<typeof vi.fn> };
  let confirm: { confirmar: ReturnType<typeof vi.fn> };
  let noti: { exito: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  function crear(): ProfesionalDisponibilidades {
    return TestBed.createComponent(ProfesionalDisponibilidades).componentInstance;
  }

  beforeEach(async () => {
    api = {
      crearDisponibilidad: vi.fn().mockReturnValue(of({})),
      listarDisponibilidades: vi.fn().mockReturnValue(of([])),
      eliminarDisponibilidad: vi.fn().mockReturnValue(of(undefined)),
    };
    profesionalApi = { obtenerMiProfesional: vi.fn().mockReturnValue(of({ id: 7 })) };
    confirm = { confirmar: vi.fn().mockReturnValue(of(true)) };
    noti = { exito: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ProfesionalDisponibilidades],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DisponibilidadService, useValue: api },
        { provide: ProfesionalService, useValue: profesionalApi },
        { provide: ConfirmService, useValue: confirm },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('lista las franjas del profesional autenticado', () => {
    crear();
    expect(api.listarDisponibilidades).toHaveBeenCalledWith({ profesionalId: 7 });
  });

  it('crea una franja con el profesionalId de /me y recarga', () => {
    const cmp = crear() as any;
    cmp.form.setValue({ diaSemana: 'MARTES', horaInicio: '09:00', horaFin: '12:00' });
    cmp.crear();
    expect(api.crearDisponibilidad).toHaveBeenCalledWith({
      profesionalId: 7,
      diaSemana: 'MARTES',
      horaInicio: '09:00',
      horaFin: '12:00',
    });
    expect(noti.exito).toHaveBeenCalled();
  });

  it('no crea si la hora de fin no es posterior a la de inicio', () => {
    const cmp = crear() as any;
    cmp.form.setValue({ diaSemana: 'LUNES', horaInicio: '15:00', horaFin: '09:00' });
    cmp.crear();
    expect(api.crearDisponibilidad).not.toHaveBeenCalled();
    expect(noti.error).toHaveBeenCalled();
  });

  it('borra una franja tras confirmar', () => {
    const cmp = crear() as any;
    cmp.borrar({ id: 3, diaSemana: 'LUNES', horaInicio: '09:00:00', horaFin: '10:00:00' });
    expect(api.eliminarDisponibilidad).toHaveBeenCalledWith(3);
  });
});
