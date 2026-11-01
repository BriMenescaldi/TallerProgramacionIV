package com.taller4.sistematurnos.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

/** Reserva de un servicio: un cliente con un profesional en una fecha/hora. */
@Entity
@Table(name = "turnos")
@Data
public class Turno {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "cliente_id", nullable = false)
  @ToString.Exclude
  private Usuario cliente;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "profesional_id", nullable = false)
  @ToString.Exclude
  private Profesional profesional;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "servicio_id", nullable = false)
  @ToString.Exclude
  private Servicio servicio;

  @Column(name = "fecha_hora", nullable = false)
  private LocalDateTime fechaHora;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private EstadoTurno estado = EstadoTurno.PENDIENTE;

  @CreationTimestamp
  @Column(name = "creado_en", nullable = false, updatable = false)
  private Instant creadoEn;
}
