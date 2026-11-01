package com.taller4.sistematurnos.mapper;

import com.taller4.sistematurnos.dto.ProfesionalEntradaDTO;
import com.taller4.sistematurnos.dto.ProfesionalSalidaDTO;
import com.taller4.sistematurnos.entity.Profesional;

/** Mapeo entre Profesional y sus DTOs. Anida el Usuario asociado. */
public final class ProfesionalMapper {

  private ProfesionalMapper() {}

  public static ProfesionalSalidaDTO toDto(Profesional profesional) {
    if (profesional == null) {
      return null;
    }
    return new ProfesionalSalidaDTO(
        profesional.getId(),
        UsuarioMapper.toDto(profesional.getUsuario()),
        profesional.getEspecialidad(),
        profesional.getBio(),
        profesional.getTelefono());
  }

  /** El {@code Usuario} anidado se crea desde la entrada (cascade ALL en el {@code @OneToOne}). */
  public static Profesional toEntity(ProfesionalEntradaDTO dto) {
    if (dto == null) {
      return null;
    }
    Profesional profesional = new Profesional();
    profesional.setUsuario(UsuarioMapper.toEntity(dto.usuario()));
    profesional.setEspecialidad(dto.especialidad());
    profesional.setBio(dto.bio());
    profesional.setTelefono(dto.telefono());
    return profesional;
  }
}
