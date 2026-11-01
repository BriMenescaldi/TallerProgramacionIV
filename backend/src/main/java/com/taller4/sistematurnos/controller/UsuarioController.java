package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.PerfilUsuarioDTO;
import com.taller4.sistematurnos.dto.UsuarioEntradaDTO;
import com.taller4.sistematurnos.dto.UsuarioSalidaDTO;
import com.taller4.sistematurnos.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * ABM de usuarios (solo ADMIN). El alta de clientes va por /api/auth/register; la de profesionales
 * por /api/profesionales. Acá no hay POST.
 */
@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuario", description = "Gestión de usuarios y clientes del sistema")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

  private final UsuarioService service;

  public UsuarioController(UsuarioService service) {
    this.service = service;
  }

  @GetMapping
  @Operation(operationId = "listarUsuarios", summary = "Listar todos los usuarios")
  public List<UsuarioSalidaDTO> listar() {
    return service.listar();
  }

  @GetMapping("/{id}")
  @Operation(operationId = "obtenerUsuario", summary = "Obtener un usuario por id")
  public UsuarioSalidaDTO obtener(@PathVariable Long id) {
    return service.obtener(id);
  }

  @PutMapping("/me")
  @PreAuthorize("isAuthenticated()")
  @Operation(
      operationId = "actualizarMiPerfil",
      summary = "Editar el perfil propio (nombre) del usuario autenticado")
  public UsuarioSalidaDTO actualizarPerfil(
      @Valid @RequestBody PerfilUsuarioDTO dto, Principal principal) {
    return service.actualizarPerfil(principal.getName(), dto);
  }

  @PutMapping("/{id}")
  @Operation(operationId = "actualizarUsuario", summary = "Actualizar un usuario")
  public UsuarioSalidaDTO actualizar(
      @PathVariable Long id, @Valid @RequestBody UsuarioEntradaDTO dto) {
    return service.actualizar(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(operationId = "eliminarUsuario", summary = "Eliminar (baja lógica) un usuario")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
