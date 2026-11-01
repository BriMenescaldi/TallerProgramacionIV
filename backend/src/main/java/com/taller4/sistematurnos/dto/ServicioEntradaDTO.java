package com.taller4.sistematurnos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ServicioEntradaDTO(
    Long id,
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank String descripcion,
    @NotNull @Positive Integer duracionMin,
    @NotNull @Positive BigDecimal precio) {}
