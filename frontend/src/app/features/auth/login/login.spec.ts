import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { Login } from './login';

describe('Login', () => {
  let sesion: { login: ReturnType<typeof vi.fn> };
  let noti: { error: ReturnType<typeof vi.fn>; exito: ReturnType<typeof vi.fn> };
  let navigate: ReturnType<typeof vi.fn>;

  function crear(): Login {
    const cmp = TestBed.createComponent(Login).componentInstance;
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true) as never;
    return cmp;
  }

  beforeEach(async () => {
    sesion = { login: vi.fn() };
    noti = { error: vi.fn(), exito: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SesionService, useValue: sesion },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('no llama a login si el formulario está vacío', () => {
    const cmp = crear() as any;
    cmp.ingresar();
    expect(sesion.login).not.toHaveBeenCalled();
  });

  it('loguea y navega a /inicio cuando es exitoso', () => {
    sesion.login.mockReturnValue(of({ token: 't', usuario: {} }));
    const cmp = crear() as any;
    cmp.form.setValue({ email: 'admin', password: 'admin' });
    cmp.ingresar();
    expect(sesion.login).toHaveBeenCalledWith({ email: 'admin', password: 'admin' });
    expect(navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('muestra error y no navega si el login falla', () => {
    sesion.login.mockReturnValue(throwError(() => ({ status: 401 })));
    const cmp = crear() as any;
    cmp.form.setValue({ email: 'admin', password: 'mala' });
    cmp.ingresar();
    expect(noti.error).toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
