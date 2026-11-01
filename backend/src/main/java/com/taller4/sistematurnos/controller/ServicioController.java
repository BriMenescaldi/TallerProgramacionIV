package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.ServicioEntradaDTO;
import com.taller4.sistematurnos.dto.ServicioSalidaDTO;
import com.taller4.sistematurnos.service.ServicioService;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servicios")
@Tag(name = "Servicio", description = "Gestión de los servicios ofrecidos en el sistema")
public class ServicioController {

  private final ServicioService service;

  public ServicioController(ServicioService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(operationId = "crearServicio", summary = "Crear un servicio")
  public ServicioSalidaDTO crear(@Valid @RequestBody ServicioEntradaDTO dto) {
    return service.crear(dto);
  }

  @GetMapping
  @Operation(operationId = "listarServicios", summary = "Listar todos los servicios")
  public List<ServicioSalidaDTO> listar() {
    return service.listar();
  }

  @GetMapping("/{id}")
  @Operation(operationId = "obtenerServicio", summary = "Obtener un servicio por id")
  public ServicioSalidaDTO obtener(@PathVariable Long id) {
    return service.obtener(id);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(operationId = "actualizarServicio", summary = "Actualizar un servicio")
  public ServicioSalidaDTO actualizar(
      @PathVariable Long id, @Valid @RequestBody ServicioEntradaDTO dto) {
    return service.actualizar(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(operationId = "eliminarServicio", summary = "Eliminar un servicio")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
