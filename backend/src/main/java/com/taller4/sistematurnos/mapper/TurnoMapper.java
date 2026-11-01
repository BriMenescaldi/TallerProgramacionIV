package com.taller4.sistematurnos.mapper;

import com.taller4.sistematurnos.dto.TurnoEntradaDTO;
import com.taller4.sistematurnos.dto.TurnoSalidaDTO;
import com.taller4.sistematurnos.entity.Profesional;
import com.taller4.sistematurnos.entity.Servicio;
import com.taller4.sistematurnos.entity.Turno;
import com.taller4.sistematurnos.entity.Usuario;

/** Mapeo entre Turno y sus DTOs. La salida anida servicio, profesional y cliente. */
public final class TurnoMapper {

  private TurnoMapper() {}

  public static TurnoSalidaDTO toDto(Turno turno) {
    if (turno == null) {
      return null;
    }
    return new TurnoSalidaDTO(
        turno.getId(),
        ServicioMapper.toDto(turno.getServicio()),
        ProfesionalMapper.toDto(turno.getProfesional()),
        UsuarioMapper.toDto(turno.getCliente()),
        turno.getFechaHora(),
        turno.getEstado(),
        turno.getCreadoEn());
  }

  /**
   * Las relaciones las resuelve el service desde los ids de la entrada. El estado inicial
   * (PENDIENTE) y creadoEn los setea la entidad/Hibernate.
   */
  public static Turno toEntity(
      TurnoEntradaDTO dto, Usuario cliente, Profesional profesional, Servicio servicio) {
    if (dto == null) {
      return null;
    }
    Turno turno = new Turno();
    turno.setCliente(cliente);
    turno.setProfesional(profesional);
    turno.setServicio(servicio);
    turno.setFechaHora(dto.fechaHora());
    return turno;
  }
}
