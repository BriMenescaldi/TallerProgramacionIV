package com.taller4.sistematurnos.repository;

import com.taller4.sistematurnos.entity.Disponibilidad;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {

  List<Disponibilidad> findByProfesionalId(Long profesionalId);
}
