package com.taller4.sistematurnos.entity;

import jakarta.persistence.*;
import java.time.LocalTime;
import lombok.Data;
import lombok.ToString;

/** Franja horaria recurrente (semanal) que ofrece un profesional. */
@Entity
@Table(name = "disponibilidades")
@Data
public class Disponibilidad {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "profesional_id", nullable = false)
  @ToString.Exclude
  private Profesional profesional;

  @Enumerated(EnumType.STRING)
  @Column(name = "dia_semana", nullable = false, length = 10)
  private DiaSemana diaSemana;

  @Column(name = "hora_inicio", nullable = false)
  private LocalTime horaInicio;

  @Column(name = "hora_fin", nullable = false)
  private LocalTime horaFin;
}
