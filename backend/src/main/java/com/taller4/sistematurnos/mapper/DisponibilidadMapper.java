package com.taller4.sistematurnos.mapper;

import com.taller4.sistematurnos.dto.DisponibilidadEntradaDTO;
import com.taller4.sistematurnos.dto.DisponibilidadSalidaDTO;
import com.taller4.sistematurnos.entity.Disponibilidad;
import com.taller4.sistematurnos.entity.Profesional;

/** Mapeo entre Disponibilidad y sus DTOs. */
public final class DisponibilidadMapper {

  private DisponibilidadMapper() {}

  public static DisponibilidadSalidaDTO toDto(Disponibilidad disponibilidad) {
    if (disponibilidad == null) {
      return null;
    }
    return new DisponibilidadSalidaDTO(
        disponibilidad.getId(),
        ProfesionalMapper.toDto(disponibilidad.getProfesional()),
        disponibilidad.getDiaSemana(),
        disponibilidad.getHoraInicio(),
        disponibilidad.getHoraFin());
  }

  /** El profesional lo resuelve el service desde dto.profesionalId(). */
  public static Disponibilidad toEntity(DisponibilidadEntradaDTO dto, Profesional profesional) {
    if (dto == null) {
      return null;
    }
    Disponibilidad disponibilidad = new Disponibilidad();
    disponibilidad.setProfesional(profesional);
    disponibilidad.setDiaSemana(dto.diaSemana());
    disponibilidad.setHoraInicio(dto.horaInicio());
    disponibilidad.setHoraFin(dto.horaFin());
    return disponibilidad;
  }
}
