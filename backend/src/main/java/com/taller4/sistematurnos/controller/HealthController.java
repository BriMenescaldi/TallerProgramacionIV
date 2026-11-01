package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.HealthStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Estado del backend")
public class HealthController {

  @GetMapping
  @Operation(summary = "Devuelve el estado actual del backend")
  public HealthStatus health() {
    return new HealthStatus("UP", Instant.now());
  }
}
