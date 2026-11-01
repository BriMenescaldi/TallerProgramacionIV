import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import type { UsuarioSalidaDTORol } from '../../api/generated/model';
import { SesionService } from '../../auth/sesion.service';

interface NavItem {
  etiqueta: string;
  ruta: string;
  icono: string;
  exacto?: boolean;
}

const NAV_POR_ROL: Record<UsuarioSalidaDTORol, NavItem[]> = {
  ADMIN: [
    { etiqueta: 'Inicio', ruta: '/inicio/admin', icono: 'dashboard', exacto: true },
    { etiqueta: 'Servicios', ruta: '/inicio/admin/servicios', icono: 'design_services' },
    { etiqueta: 'Profesionales', ruta: '/inicio/admin/profesionales', icono: 'badge' },
    { etiqueta: 'Usuarios', ruta: '/inicio/admin/usuarios', icono: 'group' },
  ],
  PROFESIONAL: [
    { etiqueta: 'Inicio', ruta: '/inicio/profesional', icono: 'dashboard', exacto: true },
    { etiqueta: 'Mis turnos', ruta: '/inicio/profesional/mis-turnos', icono: 'event' },
    {
      etiqueta: 'Crear disponibilidad',
      ruta: '/inicio/profesional/crear-disponibilidad',
      icono: 'schedule',
    },
    { etiqueta: 'Mi perfil', ruta: '/inicio/profesional/mi-perfil', icono: 'person' },
  ],
  CLIENTE: [
    { etiqueta: 'Inicio', ruta: '/inicio/cliente', icono: 'dashboard', exacto: true },
    {
      etiqueta: 'Disponibilidades',
      ruta: '/inicio/cliente/disponibilidades',
      icono: 'event_available',
    },
    { etiqueta: 'Mis turnos', ruta: '/inicio/cliente/mis-turnos', icono: 'event' },
    { etiqueta: 'Mi perfil', ruta: '/inicio/cliente/mi-perfil', icono: 'person' },
  ],
};

/** Chrome de la app autenticada: toolbar + sidebar con navegación según el rol. */
@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly sesion = inject(SesionService);

  protected readonly usuario = this.sesion.usuario;
  protected readonly navItems = computed<NavItem[]>(() => {
    const rol = this.sesion.rol();
    return rol ? NAV_POR_ROL[rol] : [];
  });

  protected logout(): void {
    this.sesion.logout();
  }
}
