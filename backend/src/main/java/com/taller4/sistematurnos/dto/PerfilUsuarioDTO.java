package com.taller4.sistematurnos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Autoedición del perfil del usuario autenticado. Solo permite cambiar el nombre; el rol, el email
 * (identidad del token) y el estado activo no se tocan por esta vía.
 */
public record PerfilUsuarioDTO(@NotBlank @Size(max = 100) String nombre) {}
