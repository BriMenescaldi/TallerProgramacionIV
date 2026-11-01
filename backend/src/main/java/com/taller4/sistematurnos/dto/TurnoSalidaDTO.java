package com.taller4.sistematurnos.dto;

import com.taller4.sistematurnos.entity.EstadoTurno;
import java.time.Instant;
import java.time.LocalDateTime;

public record TurnoSalidaDTO(
    Long id,
    ServicioSalidaDTO servicio,
    ProfesionalSalidaDTO profesional,
    UsuarioSalidaDTO cliente,
    LocalDateTime fechaHora,
    EstadoTurno estado,
    Instant creadoEn) {}
