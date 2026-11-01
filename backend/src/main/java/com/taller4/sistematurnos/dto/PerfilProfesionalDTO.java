package com.taller4.sistematurnos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Autoedición del perfil profesional del usuario autenticado. Solo los campos propios del
 * profesional; el nombre del usuario se edita por {@code PUT /api/usuarios/me}.
 */
public record PerfilProfesionalDTO(
    @NotBlank @Size(max = 100) String especialidad, String bio, @Size(max = 20) String telefono) {}
