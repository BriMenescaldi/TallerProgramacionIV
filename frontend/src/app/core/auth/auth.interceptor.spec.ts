import { HttpEvent, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { SesionService } from './sesion.service';

describe('authInterceptor', () => {
  let sesion: { token: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    sesion = { token: vi.fn(), logout: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: SesionService, useValue: sesion }],
    });
  });

  function ejecutar(next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>): {
    req?: HttpRequest<unknown>;
    obs: Observable<HttpEvent<unknown>>;
  } {
    const original = new HttpRequest('GET', '/api/turnos');
    const captura: { req?: HttpRequest<unknown> } = {};
    const obs = TestBed.runInInjectionContext(() =>
      authInterceptor(original, (req) => {
        captura.req = req;
        return next(req);
      }),
    );
    return {
      get req() {
        return captura.req;
      },
      obs,
    };
  }

  it('agrega el header Authorization cuando hay token', () => {
    sesion.token.mockReturnValue('jwt-abc');
    const r = ejecutar(() => of({} as HttpEvent<unknown>));
    r.obs.subscribe();
    expect(r.req?.headers.get('Authorization')).toBe('Bearer jwt-abc');
  });

  it('no agrega header cuando no hay token', () => {
    sesion.token.mockReturnValue(null);
    const r = ejecutar(() => of({} as HttpEvent<unknown>));
    r.obs.subscribe();
    expect(r.req?.headers.has('Authorization')).toBe(false);
  });

  it('ante un 401 hace logout', () => {
    sesion.token.mockReturnValue('jwt-abc');
    const r = ejecutar(() => throwError(() => ({ status: 401 })));
    r.obs.subscribe({ error: () => {} });
    expect(sesion.logout).toHaveBeenCalledOnce();
  });

  it('ante otros errores NO hace logout', () => {
    sesion.token.mockReturnValue('jwt-abc');
    const r = ejecutar(() => throwError(() => ({ status: 500 })));
    r.obs.subscribe({ error: () => {} });
    expect(sesion.logout).not.toHaveBeenCalled();
  });
});
