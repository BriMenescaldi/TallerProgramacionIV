package com.taller4.sistematurnos.mapper;

import com.taller4.sistematurnos.dto.UsuarioEntradaDTO;
import com.taller4.sistematurnos.dto.UsuarioSalidaDTO;
import com.taller4.sistematurnos.entity.Usuario;

/** Mapeo entre Usuario y sus DTOs. La salida nunca expone passwordHash. */
public final class UsuarioMapper {

  private UsuarioMapper() {}

  public static UsuarioSalidaDTO toDto(Usuario usuario) {
    if (usuario == null) {
      return null;
    }
    return new UsuarioSalidaDTO(
        usuario.getId(),
        usuario.getNombre(),
        usuario.getEmail(),
        usuario.getRol(),
        usuario.isActivo());
  }

  /** Construye la entidad desde la entrada. No setea passwordHash (lo maneja el ciclo de auth). */
  public static Usuario toEntity(UsuarioEntradaDTO dto) {
    if (dto == null) {
      return null;
    }
    Usuario usuario = new Usuario();
    usuario.setNombre(dto.nombre());
    usuario.setEmail(dto.email());
    usuario.setRol(dto.rol());
    usuario.setActivo(dto.activo());
    return usuario;
  }
}
