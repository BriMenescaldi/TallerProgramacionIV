package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.PerfilProfesionalDTO;
import com.taller4.sistematurnos.dto.ProfesionalEntradaDTO;
import com.taller4.sistematurnos.dto.ProfesionalSalidaDTO;
import com.taller4.sistematurnos.service.ProfesionalService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profesionales")
@Tag(name = "Profesional", description = "Gestión de los profesionales prestadores del servicio")
public class ProfesionalController {

  private final ProfesionalService service;

  public ProfesionalController(ProfesionalService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(operationId = "crearProfesional", summary = "Crear un profesional")
  public ProfesionalSalidaDTO crear(@Valid @RequestBody ProfesionalEntradaDTO dto) {
    return service.crear(dto);
  }

  @GetMapping
  @Operation(operationId = "listarProfesionales", summary = "Listar todos los profesionales")
  public List<ProfesionalSalidaDTO> listar() {
    return service.listar();
  }

  @GetMapping("/me")
  @PreAuthorize("hasRole('PROFESIONAL')")
  @Operation(
      operationId = "obtenerMiProfesional",
      summary = "Obtener el profesional del usuario autenticado")
  public ProfesionalSalidaDTO obtenerMio(Principal principal) {
    return service.obtenerPorEmail(principal.getName());
  }

  @PutMapping("/me")
  @PreAuthorize("hasRole('PROFESIONAL')")
  @Operation(
      operationId = "actualizarMiProfesional",
      summary = "Editar el perfil profesional propio (especialidad/bio/teléfono)")
  public ProfesionalSalidaDTO actualizarMiPerfil(
      @Valid @RequestBody PerfilProfesionalDTO dto, Principal principal) {
    return service.actualizarMiPerfil(principal.getName(), dto);
  }

  @GetMapping("/{id}")
  @Operation(operationId = "obtenerProfesional", summary = "Obtener un profesional por id")
  public ProfesionalSalidaDTO obtener(@PathVariable Long id) {
    return service.obtener(id);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(operationId = "actualizarProfesional", summary = "Actualizar un profesional")
  public ProfesionalSalidaDTO actualizar(
      @PathVariable Long id, @Valid @RequestBody ProfesionalEntradaDTO dto) {
    return service.actualizar(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(operationId = "eliminarProfesional", summary = "Eliminar un profesional")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
