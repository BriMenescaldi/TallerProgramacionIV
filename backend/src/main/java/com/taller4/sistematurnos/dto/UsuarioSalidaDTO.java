package com.taller4.sistematurnos.dto;

import com.taller4.sistematurnos.entity.Rol;

/** Salida de un usuario. Nunca incluye passwordHash. */
public record UsuarioSalidaDTO(Long id, String nombre, String email, Rol rol, boolean activo) {}
