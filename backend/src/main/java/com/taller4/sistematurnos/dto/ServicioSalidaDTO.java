package com.taller4.sistematurnos.dto;

import java.math.BigDecimal;

public record ServicioSalidaDTO(
    Long id, String nombre, String descripcion, Integer duracionMin, BigDecimal precio) {}
