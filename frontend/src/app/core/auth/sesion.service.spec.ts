import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../api/generated/auth/auth.service';
import type { AuthRespuestaDTO } from '../api/generated/model';
import { SesionService } from './sesion.service';

const RESPUESTA_CLIENTE: AuthRespuestaDTO = {
  token: 'jwt-abc',
  usuario: { id: 7, nombre: 'Ana', email: 'ana@test.com', rol: 'CLIENTE', activo: true },
};

describe('SesionService', () => {
  let authApi: { login: ReturnType<typeof vi.fn>; register: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  function crear(): SesionService {
    return TestBed.runInInjectionContext(() => new SesionService());
  }

  beforeEach(() => {
    localStorage.clear();
    authApi = {
      login: vi.fn().mockReturnValue(of(RESPUESTA_CLIENTE)),
      register: vi.fn().mockReturnValue(of(RESPUESTA_CLIENTE)),
    };
    router = { navigate: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authApi },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('arranca deslogueado cuando no hay sesión guardada', () => {
    const sesion = crear();
    expect(sesion.isLoggedIn()).toBe(false);
    expect(sesion.usuario()).toBeNull();
    expect(sesion.rol()).toBeNull();
    expect(sesion.token()).toBeNull();
  });

  it('hidrata la sesión desde localStorage al construirse', () => {
    localStorage.setItem('token', RESPUESTA_CLIENTE.token!);
    localStorage.setItem('usuario', JSON.stringify(RESPUESTA_CLIENTE.usuario));
    const sesion = crear();
    expect(sesion.isLoggedIn()).toBe(true);
    expect(sesion.usuario()?.email).toBe('ana@test.com');
    expect(sesion.rol()).toBe('CLIENTE');
  });

  it('login exitoso guarda token + usuario y queda logueado', () => {
    const sesion = crear();
    sesion.login({ email: 'ana@test.com', password: 'secreto123' }).subscribe();
    expect(authApi.login).toHaveBeenCalledOnce();
    expect(sesion.isLoggedIn()).toBe(true);
    expect(sesion.rol()).toBe('CLIENTE');
    expect(localStorage.getItem('token')).toBe('jwt-abc');
    expect(JSON.parse(localStorage.getItem('usuario')!).id).toBe(7);
  });

  it('register exitoso guarda la sesión igual que login', () => {
    const sesion = crear();
    sesion.register({ nombre: 'Ana', email: 'ana@test.com', password: 'secreto123' }).subscribe();
    expect(authApi.register).toHaveBeenCalledOnce();
    expect(sesion.isLoggedIn()).toBe(true);
  });

  it('logout limpia la sesión y navega a /login', () => {
    localStorage.setItem('token', RESPUESTA_CLIENTE.token!);
    localStorage.setItem('usuario', JSON.stringify(RESPUESTA_CLIENTE.usuario));
    const sesion = crear();
    sesion.logout();
    expect(sesion.isLoggedIn()).toBe(false);
    expect(sesion.usuario()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
