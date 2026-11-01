package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.CambioEstadoTurnoDTO;
import com.taller4.sistematurnos.dto.TurnoEntradaDTO;
import com.taller4.sistematurnos.dto.TurnoSalidaDTO;
import com.taller4.sistematurnos.service.TurnoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/turnos")
@Tag(name = "Turno", description = "Reservas de turnos y su ciclo de estado")
public class TurnoController {

  private final TurnoService service;

  public TurnoController(TurnoService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")
  @Operation(operationId = "crearTurno", summary = "Crear un turno (estado inicial PENDIENTE)")
  public TurnoSalidaDTO crear(@Valid @RequestBody TurnoEntradaDTO dto) {
    return service.crear(dto);
  }

  @GetMapping
  @Operation(
      operationId = "listarTurnos",
      summary = "Listar turnos, opcionalmente por cliente o por profesional")
  public List<TurnoSalidaDTO> listar(
      @RequestParam(required = false) Long clienteId,
      @RequestParam(required = false) Long profesionalId) {
    return service.listar(clienteId, profesionalId);
  }

  @GetMapping("/{id}")
  @Operation(operationId = "obtenerTurno", summary = "Obtener un turno por id")
  public TurnoSalidaDTO obtener(@PathVariable Long id) {
    return service.obtener(id);
  }

  @PatchMapping("/{id}/estado")
  @PreAuthorize("hasAnyRole('CLIENTE', 'PROFESIONAL', 'ADMIN')")
  @Operation(
      operationId = "cambiarEstadoTurno",
      summary = "Cambiar el estado de un turno (el cliente lo usa para cancelar)")
  public TurnoSalidaDTO cambiarEstado(
      @PathVariable Long id, @Valid @RequestBody CambioEstadoTurnoDTO dto) {
    return service.cambiarEstado(id, dto.estado());
  }
}
