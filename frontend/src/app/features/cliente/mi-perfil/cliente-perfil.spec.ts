import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { SesionService } from '../../../core/auth/sesion.service';
import { NotificacionService } from '../../../shared/ui/notificacion.service';
import { ClientePerfil } from './cliente-perfil';

describe('ClientePerfil', () => {
  let usuarioApi: { actualizarMiPerfil: ReturnType<typeof vi.fn> };
  let sesion: { usuario: ReturnType<typeof vi.fn>; guardarUsuario: ReturnType<typeof vi.fn> };
  let noti: { exito: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  function crear(): ClientePerfil {
    return TestBed.createComponent(ClientePerfil).componentInstance;
  }

  beforeEach(async () => {
    usuarioApi = { actualizarMiPerfil: vi.fn() };
    sesion = { usuario: vi.fn().mockReturnValue({ nombre: 'Ana' }), guardarUsuario: vi.fn() };
    noti = { exito: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ClientePerfil],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UsuarioService, useValue: usuarioApi },
        { provide: SesionService, useValue: sesion },
        { provide: NotificacionService, useValue: noti },
      ],
    }).compileComponents();
  });

  it('precarga el nombre del usuario en sesión', () => {
    const cmp = crear() as any;
    expect(cmp.form.getRawValue().nombre).toBe('Ana');
  });

  it('no llama a la API si el nombre está vacío', () => {
    sesion.usuario.mockReturnValue(null);
    const cmp = crear() as any;
    cmp.form.setValue({ nombre: '' });
    cmp.guardar();
    expect(usuarioApi.actualizarMiPerfil).not.toHaveBeenCalled();
  });

  it('guarda, refresca la sesión y notifica éxito', () => {
    const actualizado = { id: 1, nombre: 'Ana María' };
    usuarioApi.actualizarMiPerfil.mockReturnValue(of(actualizado));
    const cmp = crear() as any;
    cmp.form.setValue({ nombre: 'Ana María' });
    cmp.guardar();
    expect(usuarioApi.actualizarMiPerfil).toHaveBeenCalledWith({ nombre: 'Ana María' });
    expect(sesion.guardarUsuario).toHaveBeenCalledWith(actualizado);
    expect(noti.exito).toHaveBeenCalled();
  });

  it('notifica error si el guardado falla', () => {
    usuarioApi.actualizarMiPerfil.mockReturnValue(throwError(() => ({ status: 500 })));
    const cmp = crear() as any;
    cmp.form.setValue({ nombre: 'Ana' });
    cmp.guardar();
    expect(noti.error).toHaveBeenCalled();
  });
});
