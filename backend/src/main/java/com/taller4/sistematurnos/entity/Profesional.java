package com.taller4.sistematurnos.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "profesionales")
@Data
public class Profesional {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
  private Usuario usuario;

  @Column(nullable = false, length = 100)
  private String especialidad;

  @Column(columnDefinition = "TEXT")
  private String bio;

  @Column(length = 20)
  private String telefono;
}
