package com.taller4.sistematurnos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Alta de un cliente. El rol (CLIENTE) lo fija el server; la password viaja en claro y se hashea.
 */
public record RegistroDTO(
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank @Email @Size(max = 100) String email,
    @NotBlank @Size(min = 6, max = 100) String password) {}
