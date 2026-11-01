package com.taller4.sistematurnos.dto;

import java.time.Instant;
import java.util.Map;

/**
 * Cuerpo de error uniforme para toda la API. {@code validationErrors} solo viene poblado en errores
 * de validación (400); en el resto es null.
 */
public record ErrorDTO(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path,
    Map<String, String> validationErrors) {}
