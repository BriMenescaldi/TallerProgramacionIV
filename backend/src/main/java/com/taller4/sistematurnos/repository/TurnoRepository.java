package com.taller4.sistematurnos.repository;

import com.taller4.sistematurnos.entity.Turno;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

  List<Turno> findByClienteId(Long clienteId);

  List<Turno> findByProfesionalId(Long profesionalId);
}
