package com.taller4.sistematurnos.dto;

import com.taller4.sistematurnos.entity.DiaSemana;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public record DisponibilidadEntradaDTO(
    @NotNull Long profesionalId,
    @NotNull DiaSemana diaSemana,
    @NotNull LocalTime horaInicio,
    @NotNull LocalTime horaFin) {}
