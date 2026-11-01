package com.taller4.sistematurnos.exception;

/** Email o password incorrectos en el login. El advice la traduce a 401. */
public class CredencialesInvalidasException extends RuntimeException {

  public CredencialesInvalidasException(String message) {
    super(message);
  }
}
