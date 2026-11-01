package com.taller4.sistematurnos.dto;

import jakarta.validation.constraints.NotBlank;

/** Credenciales para iniciar sesión. */
public record LoginDTO(@NotBlank String email, @NotBlank String password) {}
