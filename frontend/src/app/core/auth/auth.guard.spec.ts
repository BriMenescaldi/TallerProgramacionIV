import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { authGuard, guestGuard, inicioRedirectGuard, roleGuard } from './auth.guard';
import { SesionService } from './sesion.service';

describe('guards de auth', () => {
  let sesion: { isLoggedIn: ReturnType<typeof vi.fn>; rol: ReturnType<typeof vi.fn> };
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  const ruta = {} as ActivatedRouteSnapshot;
  const estado = {} as RouterStateSnapshot;

  function run(guard: (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => unknown) {
    return TestBed.runInInjectionContext(() => guard(ruta, estado));
  }

  beforeEach(() => {
    sesion = { isLoggedIn: vi.fn(), rol: vi.fn() };
    router = { createUrlTree: vi.fn((cmds) => ({ cmds }) as unknown as UrlTree) };
    TestBed.configureTestingModule({
      providers: [
        { provide: SesionService, useValue: sesion },
        { provide: Router, useValue: router },
      ],
    });
  });

  describe('authGuard', () => {
    it('permite el acceso si hay sesión', () => {
      sesion.isLoggedIn.mockReturnValue(true);
      expect(run(authGuard)).toBe(true);
    });

    it('redirige a /login si no hay sesión', () => {
      sesion.isLoggedIn.mockReturnValue(false);
      run(authGuard);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('guestGuard', () => {
    it('permite el acceso si NO hay sesión', () => {
      sesion.isLoggedIn.mockReturnValue(false);
      expect(run(guestGuard)).toBe(true);
    });

    it('redirige a /inicio si ya hay sesión', () => {
      sesion.isLoggedIn.mockReturnValue(true);
      run(guestGuard);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/inicio']);
    });
  });

  describe('roleGuard', () => {
    it('permite el acceso si el rol coincide', () => {
      sesion.rol.mockReturnValue('ADMIN');
      const guard = roleGuard('ADMIN');
      expect(TestBed.runInInjectionContext(() => guard(ruta, estado))).toBe(true);
    });

    it('redirige a /inicio si el rol no coincide', () => {
      sesion.rol.mockReturnValue('CLIENTE');
      const guard = roleGuard('ADMIN');
      TestBed.runInInjectionContext(() => guard(ruta, estado));
      expect(router.createUrlTree).toHaveBeenCalledWith(['/inicio']);
    });
  });

  describe('inicioRedirectGuard', () => {
    it('redirige al home del rol cuando hay sesión', () => {
      sesion.isLoggedIn.mockReturnValue(true);
      sesion.rol.mockReturnValue('PROFESIONAL');
      run(inicioRedirectGuard);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/inicio', 'profesional']);
    });

    it('redirige a /login cuando no hay sesión', () => {
      sesion.isLoggedIn.mockReturnValue(false);
      sesion.rol.mockReturnValue(null);
      run(inicioRedirectGuard);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
  });
});
