package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.TurnoEntradaDTO;
import com.taller4.sistematurnos.dto.TurnoSalidaDTO;
import com.taller4.sistematurnos.entity.EstadoTurno;
import com.taller4.sistematurnos.entity.Profesional;
import com.taller4.sistematurnos.entity.Servicio;
import com.taller4.sistematurnos.entity.Turno;
import com.taller4.sistematurnos.entity.Usuario;
import com.taller4.sistematurnos.exception.RecursoNoEncontradoException;
import com.taller4.sistematurnos.mapper.TurnoMapper;
import com.taller4.sistematurnos.repository.ProfesionalRepository;
import com.taller4.sistematurnos.repository.ServicioRepository;
import com.taller4.sistematurnos.repository.TurnoRepository;
import com.taller4.sistematurnos.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Gestión de turnos: alta, listado filtrado y cambio de estado. Las reglas de negocio
 * (disponibilidad, anti-solapamiento, transiciones válidas de estado) se agregan en un ciclo
 * posterior.
 */
@Service
@Transactional
public class TurnoService {

  private final TurnoRepository turnoRepository;
  private final UsuarioRepository usuarioRepository;
  private final ProfesionalRepository profesionalRepository;
  private final ServicioRepository servicioRepository;

  public TurnoService(
      TurnoRepository turnoRepository,
      UsuarioRepository usuarioRepository,
      ProfesionalRepository profesionalRepository,
      ServicioRepository servicioRepository) {
    this.turnoRepository = turnoRepository;
    this.usuarioRepository = usuarioRepository;
    this.profesionalRepository = profesionalRepository;
    this.servicioRepository = servicioRepository;
  }

  public TurnoSalidaDTO crear(TurnoEntradaDTO dto) {
    Usuario cliente =
        usuarioRepository
            .findById(dto.clienteId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", dto.clienteId()));
    Profesional profesional =
        profesionalRepository
            .findById(dto.profesionalId())
            .orElseThrow(
                () -> new RecursoNoEncontradoException("Profesional", dto.profesionalId()));
    Servicio servicio =
        servicioRepository
            .findById(dto.servicioId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Servicio", dto.servicioId()));
    Turno turno = TurnoMapper.toEntity(dto, cliente, profesional, servicio);
    return TurnoMapper.toDto(turnoRepository.save(turno));
  }

  @Transactional(readOnly = true)
  public List<TurnoSalidaDTO> listar(Long clienteId, Long profesionalId) {
    List<Turno> turnos;
    if (clienteId != null) {
      turnos = turnoRepository.findByClienteId(clienteId);
    } else if (profesionalId != null) {
      turnos = turnoRepository.findByProfesionalId(profesionalId);
    } else {
      turnos = turnoRepository.findAll();
    }
    return turnos.stream().map(TurnoMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public TurnoSalidaDTO obtener(Long id) {
    return TurnoMapper.toDto(buscar(id));
  }

  public TurnoSalidaDTO cambiarEstado(Long id, EstadoTurno nuevoEstado) {
    Turno turno = buscar(id);
    turno.setEstado(nuevoEstado);
    return TurnoMapper.toDto(turnoRepository.save(turno));
  }

  private Turno buscar(Long id) {
    return turnoRepository
        .findById(id)
        .orElseThrow(() -> new RecursoNoEncontradoException("Turno", id));
  }
}
