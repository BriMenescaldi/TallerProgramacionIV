package com.taller4.sistematurnos.mapper;

import com.taller4.sistematurnos.dto.ServicioEntradaDTO;
import com.taller4.sistematurnos.dto.ServicioSalidaDTO;
import com.taller4.sistematurnos.entity.Servicio;

/** Mapeo entre Servicio y sus DTOs. */
public final class ServicioMapper {

  private ServicioMapper() {}

  public static ServicioSalidaDTO toDto(Servicio servicio) {
    if (servicio == null) {
      return null;
    }
    return new ServicioSalidaDTO(
        servicio.getId(),
        servicio.getNombre(),
        servicio.getDescripcion(),
        servicio.getDuracionMin(),
        servicio.getPrecio());
  }

  public static Servicio toEntity(ServicioEntradaDTO dto) {
    if (dto == null) {
      return null;
    }
    Servicio servicio = new Servicio();
    servicio.setNombre(dto.nombre());
    servicio.setDescripcion(dto.descripcion());
    servicio.setDuracionMin(dto.duracionMin());
    servicio.setPrecio(dto.precio());
    return servicio;
  }
}
