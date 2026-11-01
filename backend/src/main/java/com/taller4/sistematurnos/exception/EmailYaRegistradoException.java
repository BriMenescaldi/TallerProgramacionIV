package com.taller4.sistematurnos.exception;

/** El email del registro ya existe. El advice la traduce a 409. */
public class EmailYaRegistradoException extends RuntimeException {

  public EmailYaRegistradoException(String email) {
    super("Ya existe un usuario con el email: " + email);
  }
}
