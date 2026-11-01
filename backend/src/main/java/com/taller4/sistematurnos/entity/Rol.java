package com.taller4.sistematurnos.entity;

/**
 * Rol de un Usuario. Define qué puede hacer cada cuenta:
 *
 * <ul>
 *   <li>ADMIN: CRUD de servicios y usuarios, ve todo.
 *   <li>PROFESIONAL: gestiona su disponibilidad, ve/confirma sus turnos.
 *   <li>CLIENTE: crea/cancela sus turnos, ve servicios y disponibilidad, deja reseñas.
 * </ul>
 */
public enum Rol {
  ADMIN,
  PROFESIONAL,
  CLIENTE
}
