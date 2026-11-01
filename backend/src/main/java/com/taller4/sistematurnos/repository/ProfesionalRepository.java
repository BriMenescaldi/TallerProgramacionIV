package com.taller4.sistematurnos.repository;

import com.taller4.sistematurnos.entity.Profesional;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfesionalRepository extends JpaRepository<Profesional, Long> {

  /** Resuelve el profesional a partir del email de su cuenta Usuario (para el endpoint /me). */
  Optional<Profesional> findByUsuarioEmail(String email);
}
