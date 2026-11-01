package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.DisponibilidadEntradaDTO;
import com.taller4.sistematurnos.dto.DisponibilidadSalidaDTO;
import com.taller4.sistematurnos.service.DisponibilidadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/disponibilidades")
@Tag(name = "Disponibilidad", description = "Franjas horarias semanales de los profesionales")
public class DisponibilidadController {

  private final DisponibilidadService service;

  public DisponibilidadController(DisponibilidadService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasAnyRole('PROFESIONAL', 'ADMIN')")
  @Operation(operationId = "crearDisponibilidad", summary = "Crear una disponibilidad")
  public DisponibilidadSalidaDTO crear(@Valid @RequestBody DisponibilidadEntradaDTO dto) {
    return service.crear(dto);
  }

  @GetMapping
  @Operation(
      operationId = "listarDisponibilidades",
      summary = "Listar disponibilidades, opcionalmente filtradas por profesional")
  public List<DisponibilidadSalidaDTO> listar(@RequestParam(required = false) Long profesionalId) {
    return service.listar(profesionalId);
  }

  @GetMapping("/{id}")
  @Operation(operationId = "obtenerDisponibilidad", summary = "Obtener una disponibilidad por id")
  public DisponibilidadSalidaDTO obtener(@PathVariable Long id) {
    return service.obtener(id);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('PROFESIONAL', 'ADMIN')")
  @Operation(operationId = "actualizarDisponibilidad", summary = "Actualizar una disponibilidad")
  public DisponibilidadSalidaDTO actualizar(
      @PathVariable Long id, @Valid @RequestBody DisponibilidadEntradaDTO dto) {
    return service.actualizar(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasAnyRole('PROFESIONAL', 'ADMIN')")
  @Operation(operationId = "eliminarDisponibilidad", summary = "Eliminar una disponibilidad")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
