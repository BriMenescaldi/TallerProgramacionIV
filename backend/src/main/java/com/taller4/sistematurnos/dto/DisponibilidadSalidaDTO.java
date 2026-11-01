package com.taller4.sistematurnos.dto;

import com.taller4.sistematurnos.entity.DiaSemana;
import java.time.LocalTime;

public record DisponibilidadSalidaDTO(
    Long id,
    ProfesionalSalidaDTO profesional,
    DiaSemana diaSemana,
    LocalTime horaInicio,
    LocalTime horaFin) {}
