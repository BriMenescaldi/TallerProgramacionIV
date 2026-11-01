package com.taller4.sistematurnos.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Data;

@Entity
@Table(name = "servicios")
@Data
public class Servicio {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String nombre;

  @Column(columnDefinition = "TEXT")
  private String descripcion;

  @Column(name = "duracion_min", nullable = false)
  private Integer duracionMin;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal precio;
}
