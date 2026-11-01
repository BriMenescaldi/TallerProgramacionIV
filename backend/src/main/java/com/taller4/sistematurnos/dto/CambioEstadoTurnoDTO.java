package com.taller4.sistematurnos.dto;

import com.taller4.sistematurnos.entity.EstadoTurno;
import jakarta.validation.constraints.NotNull;

/** Cuerpo del cambio de estado de un turno. */
public record CambioEstadoTurnoDTO(@NotNull EstadoTurno estado) {}
