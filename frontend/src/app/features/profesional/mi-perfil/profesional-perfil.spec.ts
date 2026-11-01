import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { ProfesionalPerfil } from './profesional-perfil';

describe('ProfesionalPerfil', () => {
  let profesionalApi: {
    obtenerMiProfesional: ReturnType<typeof vi.fn>;
    actualizarMiProfesional: ReturnType<typeof vi.fn>;
  };
  let usuarioApi: { actualizarMiPerfil: ReturnType<typeof vi.fn> };
  let sesion: { usuario: ReturnType<typeof vi.fn>; guardarUsuario: ReturnType<typeof vi.fn> };
  let noti: { exito: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  function crear(): ProfesionalPerfil {
    return TestBed.createComponent(ProfesionalPerfil).componentInstance;
  }

  beforeEach(async () => {
    profesionalApi = {
      obtenerMiProfesional: vi.fn().mockReturnValue(
        of({
          id: 1,
          especialidad: 'Corte',
          bio: 'hola',
          telefono: '123',
          usuario: { nombre: 'Beto' },
        }),
      ),
      actualizarMiProfesional: vi.fn(),
    };
    usuarioApi = { actualizarMiPerfil: vi.fn() };
    sesion = { usuario: vi.fn().mockReturnValue({ nombre: 'Beto' }), guardarUsuario: vi.fn() };
    noti = { exito: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ProfesionalPerfil],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProfesionalService, useValue: profesionalApi },
        { provide: UsuarioService, useValue: usuarioApi },
        { provide: SesionService, useValue: sesion },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('carga los datos del profesional en el formulario', () => {
    const cmp = crear() as any;
    expect(cmp.form.getRawValue()).toEqual({
      nombre: 'Beto',
      especialidad: 'Corte',
      bio: 'hola',
      telefono: '123',
    });
  });

  it('guarda usuario + profesional y notifica éxito', () => {
    const usr = { id: 1, nombre: 'Beto' };
    usuarioApi.actualizarMiPerfil.mockReturnValue(of(usr));
    profesionalApi.actualizarMiProfesional.mockReturnValue(of({ id: 1 }));
    const cmp = crear() as any;
    cmp.guardar();
    expect(usuarioApi.actualizarMiPerfil).toHaveBeenCalledWith({ nombre: 'Beto' });
    expect(profesionalApi.actualizarMiProfesional).toHaveBeenCalledWith({
      especialidad: 'Corte',
      bio: 'hola',
      telefono: '123',
    });
    expect(sesion.guardarUsuario).toHaveBeenCalledWith(usr);
    expect(noti.exito).toHaveBeenCalled();
  });

  it('no guarda si la especialidad está vacía', () => {
    const cmp = crear() as any;
    cmp.form.patchValue({ especialidad: '' });
    cmp.guardar();
    expect(usuarioApi.actualizarMiPerfil).not.toHaveBeenCalled();
  });

  it('notifica error si el guardado falla', () => {
    usuarioApi.actualizarMiPerfil.mockReturnValue(throwError(() => ({ status: 500 })));
    profesionalApi.actualizarMiProfesional.mockReturnValue(of({}));
    const cmp = crear() as any;
    cmp.guardar();
    expect(noti.error).toHaveBeenCalled();
  });
});
