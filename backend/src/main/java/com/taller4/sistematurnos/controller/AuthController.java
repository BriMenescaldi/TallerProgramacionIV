package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.AuthRespuestaDTO;
import com.taller4.sistematurnos.dto.LoginDTO;
import com.taller4.sistematurnos.dto.RegistroDTO;
import com.taller4.sistematurnos.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints públicos de autenticación. No requieren token (de ahí @SecurityRequirements vacío). */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Registro y login")
@SecurityRequirements
public class AuthController {

  private final AuthService service;

  public AuthController(AuthService service) {
    this.service = service;
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Registrar un cliente y devolver su token")
  public AuthRespuestaDTO register(@Valid @RequestBody RegistroDTO dto) {
    return service.registrar(dto);
  }

  @PostMapping("/login")
  @Operation(summary = "Iniciar sesión y obtener un token")
  public AuthRespuestaDTO login(@Valid @RequestBody LoginDTO dto) {
    return service.login(dto);
  }
}
