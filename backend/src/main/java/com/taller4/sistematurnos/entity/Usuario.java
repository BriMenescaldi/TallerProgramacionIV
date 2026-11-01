package com.taller4.sistematurnos.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String nombre;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @Column(name = "password_hash", nullable = false, length = 255)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private Rol rol;

  @Column(nullable = false)
  private boolean activo = true;
}
