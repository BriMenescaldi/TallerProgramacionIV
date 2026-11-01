package com.taller4.sistematurnos.dto;

import com.taller4.sistematurnos.entity.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioEntradaDTO(
    Long id,
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank @Email @Size(max = 100) String email,
    @NotNull Rol rol,
    boolean activo) {}
