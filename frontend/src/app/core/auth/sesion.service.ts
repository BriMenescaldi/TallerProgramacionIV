import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AuthService } from '../api/generated/auth/auth.service';
import type {
  AuthRespuestaDTO,
  LoginDTO,
  RegistroDTO,
  UsuarioSalidaDTO,
  UsuarioSalidaDTORol,
} from '../api/generated/model';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

function leerUsuarioGuardado(): UsuarioSalidaDTO | null {
  const raw = localStorage.getItem(CLAVE_USUARIO);
  return raw ? (JSON.parse(raw) as UsuarioSalidaDTO) : null;
}

/**
 * Estado de sesión del usuario autenticado. Guarda el JWT y el usuario en
 * localStorage y los expone como signals. El JWT es opaco para el front: el rol
 * (guards / sidebar) sale del usuario guardado, no del token. Las llamadas HTTP
 * de auth las hace el servicio generado por orval; este servicio solo orquesta
 * el estado.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly authApi = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  private readonly _usuario = signal<UsuarioSalidaDTO | null>(leerUsuarioGuardado());

  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly rol = computed<UsuarioSalidaDTORol | null>(() => this._usuario()?.rol ?? null);
  readonly isLoggedIn = computed(() => this._token() !== null);

  login(dto: LoginDTO): Observable<AuthRespuestaDTO> {
    return this.authApi.login(dto).pipe(tap((resp) => this.guardar(resp)));
  }

  register(dto: RegistroDTO): Observable<AuthRespuestaDTO> {
    return this.authApi.register(dto).pipe(tap((resp) => this.guardar(resp)));
  }

  logout(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  guardarUsuario(usuario: UsuarioSalidaDTO): void {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this._usuario.set(usuario);
  }

  private guardar(resp: AuthRespuestaDTO): void {
    const token = resp.token ?? null;
    const usuario = resp.usuario ?? null;
    if (token) {
      localStorage.setItem(CLAVE_TOKEN, token);
    } else {
      localStorage.removeItem(CLAVE_TOKEN);
    }
    if (usuario) {
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(CLAVE_USUARIO);
    }
    this._token.set(token);
    this._usuario.set(usuario);
  }
}
