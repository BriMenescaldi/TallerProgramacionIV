package com.taller4.sistematurnos.exception;

/**
 * Se lanza desde los services cuando no existe la entidad pedida. El {@code @RestControllerAdvice}
 * la traduce a 404.
 */
public class RecursoNoEncontradoException extends RuntimeException {

  public RecursoNoEncontradoException(String message) {
    super(message);
  }

  public RecursoNoEncontradoException(String recurso, Object id) {
    super(recurso + " no encontrado: " + id);
  }
}
