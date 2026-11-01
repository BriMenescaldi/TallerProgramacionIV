package com.taller4.sistematurnos.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Entrada para crear un turno. El estado (PENDIENTE) y creadoEn los setea el server. clienteId va
 * explícito por ahora; con JWT saldrá del usuario autenticado.
 */
public record TurnoEntradaDTO(
    @NotNull Long servicioId,
    @NotNull Long profesionalId,
    @NotNull Long clienteId,
    @NotNull @Future LocalDateTime fechaHora) {}
