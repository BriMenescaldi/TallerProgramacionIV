package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.DisponibilidadEntradaDTO;
import com.taller4.sistematurnos.dto.DisponibilidadSalidaDTO;
import com.taller4.sistematurnos.entity.Disponibilidad;
import com.taller4.sistematurnos.entity.Profesional;
import com.taller4.sistematurnos.exception.RecursoNoEncontradoException;
import com.taller4.sistematurnos.mapper.DisponibilidadMapper;
import com.taller4.sistematurnos.repository.DisponibilidadRepository;
import com.taller4.sistematurnos.repository.ProfesionalRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** ABM de disponibilidades. Resuelve el profesional por id antes de mapear. */
@Service
@Transactional
public class DisponibilidadService {

  private final DisponibilidadRepository disponibilidadRepository;
  private final ProfesionalRepository profesionalRepository;

  public DisponibilidadService(
      DisponibilidadRepository disponibilidadRepository,
      ProfesionalRepository profesionalRepository) {
    this.disponibilidadRepository = disponibilidadRepository;
    this.profesionalRepository = profesionalRepository;
  }

  @Transactional(readOnly = true)
  public List<DisponibilidadSalidaDTO> listar(Long profesionalId) {
    List<Disponibilidad> disponibilidades =
        profesionalId == null
            ? disponibilidadRepository.findAll()
            : disponibilidadRepository.findByProfesionalId(profesionalId);
    return disponibilidades.stream().map(DisponibilidadMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public DisponibilidadSalidaDTO obtener(Long id) {
    return DisponibilidadMapper.toDto(buscar(id));
  }

  public DisponibilidadSalidaDTO crear(DisponibilidadEntradaDTO dto) {
    Profesional profesional = buscarProfesional(dto.profesionalId());
    Disponibilidad disponibilidad = DisponibilidadMapper.toEntity(dto, profesional);
    return DisponibilidadMapper.toDto(disponibilidadRepository.save(disponibilidad));
  }

  public DisponibilidadSalidaDTO actualizar(Long id, DisponibilidadEntradaDTO dto) {
    Disponibilidad disponibilidad = buscar(id);
    disponibilidad.setProfesional(buscarProfesional(dto.profesionalId()));
    disponibilidad.setDiaSemana(dto.diaSemana());
    disponibilidad.setHoraInicio(dto.horaInicio());
    disponibilidad.setHoraFin(dto.horaFin());
    return DisponibilidadMapper.toDto(disponibilidadRepository.save(disponibilidad));
  }

  public void eliminar(Long id) {
    disponibilidadRepository.delete(buscar(id));
  }

  private Disponibilidad buscar(Long id) {
    return disponibilidadRepository
        .findById(id)
        .orElseThrow(() -> new RecursoNoEncontradoException("Disponibilidad", id));
  }

  private Profesional buscarProfesional(Long profesionalId) {
    return profesionalRepository
        .findById(profesionalId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Profesional", profesionalId));
  }
}
