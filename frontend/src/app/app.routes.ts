import { Routes } from '@angular/router';

import { authGuard, guestGuard, inicioRedirectGuard, roleGuard } from './core/auth/auth.guard';

/**
 * Router de la app. `/inicio` monta el MainLayout (toolbar + sidebar) y debajo
 * cuelgan las secciones por rol, cada una protegida por roleGuard. Las pantallas
 * aún no implementadas apuntan al Placeholder.
 */
const placeholder = () => import('./features/placeholder/placeholder').then((m) => m.Placeholder);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', canActivate: [inicioRedirectGuard], loadComponent: placeholder },
      {
        path: 'admin',
        canActivate: [roleGuard('ADMIN')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/admin/admin-home/admin-home').then((m) => m.AdminHome),
          },
          {
            path: 'servicios',
            loadComponent: () =>
              import('./features/admin/servicios-admin/servicios-admin').then(
                (m) => m.ServiciosAdmin,
              ),
          },
          {
            path: 'usuarios',
            loadComponent: () =>
              import('./features/admin/usuarios-admin/usuarios-admin').then((m) => m.UsuariosAdmin),
          },
          {
            path: 'profesionales',
            loadComponent: () =>
              import('./features/admin/profesionales-admin/profesionales-admin').then(
                (m) => m.ProfesionalesAdmin,
              ),
          },
        ],
      },
      {
        path: 'profesional',
        canActivate: [roleGuard('PROFESIONAL')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/profesional/profesional-home/profesional-home').then(
                (m) => m.ProfesionalHome,
              ),
          },
          {
            path: 'mis-turnos',
            loadComponent: () =>
              import('./features/turnos/mis-turnos/mis-turnos').then((m) => m.MisTurnos),
          },
          {
            path: 'crear-disponibilidad',
            loadComponent: () =>
              import('./features/profesional/disponibilidades/disponibilidades').then(
                (m) => m.ProfesionalDisponibilidades,
              ),
          },
          {
            path: 'mi-perfil',
            loadComponent: () =>
              import('./features/profesional/mi-perfil/profesional-perfil').then(
                (m) => m.ProfesionalPerfil,
              ),
          },
        ],
      },
      {
        path: 'cliente',
        canActivate: [roleGuard('CLIENTE')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/cliente/cliente-home/cliente-home').then((m) => m.ClienteHome),
          },
          {
            path: 'disponibilidades',
            loadComponent: () =>
              import('./features/cliente/disponibilidades/disponibilidades').then(
                (m) => m.ClienteDisponibilidades,
              ),
          },
          {
            path: 'mis-turnos',
            loadComponent: () =>
              import('./features/turnos/mis-turnos/mis-turnos').then((m) => m.MisTurnos),
          },
          {
            path: 'mi-perfil',
            loadComponent: () =>
              import('./features/cliente/mi-perfil/cliente-perfil').then((m) => m.ClientePerfil),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
