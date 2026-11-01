package com.taller4.sistematurnos.exception;

/** Error de validación de negocio (→ 400) que no cubre jakarta.validation sobre el DTO. */
public class ValidacionException extends RuntimeException {

  public ValidacionException(String message) {
    super(message);
  }
}
