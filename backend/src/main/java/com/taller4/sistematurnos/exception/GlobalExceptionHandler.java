package com.taller4.sistematurnos.exception;

import com.taller4.sistematurnos.dto.ErrorDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Traduce las excepciones de la app a respuestas {@link ErrorDTO} con un formato uniforme. Extiende
 * {@link ResponseEntityExceptionHandler} para que las excepciones propias de Spring MVC (método no
 * permitido, body ilegible, media type, etc.) conserven su status correcto en vez de caer al 500
 * genérico.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(RecursoNoEncontradoException.class)
  public ResponseEntity<ErrorDTO> handleNoEncontrado(
      RecursoNoEncontradoException ex, HttpServletRequest req) {
    return build(HttpStatus.NOT_FOUND, ex.getMessage(), req, null);
  }

  /** Validación sobre parámetros (@RequestParam / @PathVariable). */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorDTO> handleConstraint(
      ConstraintViolationException ex, HttpServletRequest req) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req, null);
  }

  /** Validación de negocio (ej. password faltante al crear un profesional). */
  @ExceptionHandler(ValidacionException.class)
  public ResponseEntity<ErrorDTO> handleValidacion(ValidacionException ex, HttpServletRequest req) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req, null);
  }

  /** Credenciales inválidas en el login. */
  @ExceptionHandler(CredencialesInvalidasException.class)
  public ResponseEntity<ErrorDTO> handleCredenciales(
      CredencialesInvalidasException ex, HttpServletRequest req) {
    return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), req, null);
  }

  /** Email ya registrado. */
  @ExceptionHandler(EmailYaRegistradoException.class)
  public ResponseEntity<ErrorDTO> handleEmailDuplicado(
      EmailYaRegistradoException ex, HttpServletRequest req) {
    return build(HttpStatus.CONFLICT, ex.getMessage(), req, null);
  }

  /** Usuario autenticado pero sin permiso (rol insuficiente en @PreAuthorize). */
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorDTO> handleAccesoDenegado(
      AccessDeniedException ex, HttpServletRequest req) {
    return build(HttpStatus.FORBIDDEN, "No tenés permisos para esta operación", req, null);
  }

  /** Violación de integridad en BD (ej. email duplicado). */
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorDTO> handleIntegridad(
      DataIntegrityViolationException ex, HttpServletRequest req) {
    return build(HttpStatus.CONFLICT, "Conflicto con el estado actual del recurso", req, null);
  }

  /** Cualquier otra excepción no contemplada. */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDTO> handleGenerico(Exception ex, HttpServletRequest req) {
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", req, null);
  }

  /** Validación de @Valid sobre el body (DTO de entrada): override de Spring MVC. */
  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    Map<String, String> errores = new HashMap<>();
    ex.getBindingResult()
        .getFieldErrors()
        .forEach(fe -> errores.put(fe.getField(), fe.getDefaultMessage()));
    ErrorDTO body =
        buildBody(HttpStatus.BAD_REQUEST, "Error de validación", path(request), errores);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  /** Las demás excepciones de Spring MVC (405, 415, 400 por body ilegible, etc.). */
  @Override
  protected ResponseEntity<Object> handleExceptionInternal(
      Exception ex,
      Object body,
      HttpHeaders headers,
      HttpStatusCode statusCode,
      WebRequest request) {
    HttpStatus status = HttpStatus.resolve(statusCode.value());
    String reason = status != null ? status.getReasonPhrase() : "";
    ErrorDTO errorBody =
        new ErrorDTO(
            Instant.now(), statusCode.value(), reason, ex.getMessage(), path(request), null);
    return ResponseEntity.status(statusCode).headers(headers).body(errorBody);
  }

  private ResponseEntity<ErrorDTO> build(
      HttpStatus status,
      String message,
      HttpServletRequest req,
      Map<String, String> validationErrors) {
    return ResponseEntity.status(status)
        .body(buildBody(status, message, req.getRequestURI(), validationErrors));
  }

  private ErrorDTO buildBody(
      HttpStatus status, String message, String path, Map<String, String> validationErrors) {
    return new ErrorDTO(
        Instant.now(), status.value(), status.getReasonPhrase(), message, path, validationErrors);
  }

  private String path(WebRequest request) {
    return request instanceof ServletWebRequest swr ? swr.getRequest().getRequestURI() : "";
  }
}
