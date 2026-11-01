import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { Registro } from './registro';

describe('Registro', () => {
  let sesion: { register: ReturnType<typeof vi.fn> };
  let noti: { error: ReturnType<typeof vi.fn>; exito: ReturnType<typeof vi.fn> };
  let navigate: ReturnType<typeof vi.fn>;

  function crear(): Registro {
    const cmp = TestBed.createComponent(Registro).componentInstance;
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true) as never;
    return cmp;
  }

  beforeEach(async () => {
    sesion = { register: vi.fn() };
    noti = { error: vi.fn(), exito: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SesionService, useValue: sesion },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('no registra si el formulario es inválido', () => {
    const cmp = crear() as any;
    cmp.registrar();
    expect(sesion.register).not.toHaveBeenCalled();
  });

  it('no registra si la contraseña es demasiado corta', () => {
    const cmp = crear() as any;
    cmp.form.setValue({ nombre: 'Ana', email: 'ana@mail.com', password: '123' });
    cmp.registrar();
    expect(sesion.register).not.toHaveBeenCalled();
  });

  it('registra y navega a /inicio cuando es exitoso', () => {
    sesion.register.mockReturnValue(of({ token: 't', usuario: {} }));
    const cmp = crear() as any;
    cmp.form.setValue({ nombre: 'Ana', email: 'ana@mail.com', password: 'secreto' });
    cmp.registrar();
    expect(sesion.register).toHaveBeenCalledWith({
      nombre: 'Ana',
      email: 'ana@mail.com',
      password: 'secreto',
    });
    expect(navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('muestra error y no navega si el registro falla', () => {
    sesion.register.mockReturnValue(throwError(() => ({ status: 409 })));
    const cmp = crear() as any;
    cmp.form.setValue({ nombre: 'Ana', email: 'ana@mail.com', password: 'secreto' });
    cmp.registrar();
    expect(noti.error).toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
