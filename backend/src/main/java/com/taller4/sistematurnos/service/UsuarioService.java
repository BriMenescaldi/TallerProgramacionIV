package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.PerfilUsuarioDTO;
import com.taller4.sistematurnos.dto.UsuarioEntradaDTO;
import com.taller4.sistematurnos.dto.UsuarioSalidaDTO;
import com.taller4.sistematurnos.entity.Usuario;
import com.taller4.sistematurnos.exception.RecursoNoEncontradoException;
import com.taller4.sistematurnos.mapper.UsuarioMapper;
import com.taller4.sistematurnos.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ABM de usuarios. El alta NO está acá: los clientes se crean por /api/auth/register y los
 * profesionales por su propio ABM (ambos setean la password). La baja es lógica (activo = false).
 */
@Service
@Transactional
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;

  public UsuarioService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  @Transactional(readOnly = true)
  public List<UsuarioSalidaDTO> listar() {
    return usuarioRepository.findAll().stream().map(UsuarioMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public UsuarioSalidaDTO obtener(Long id) {
    return UsuarioMapper.toDto(buscar(id));
  }

  public UsuarioSalidaDTO actualizar(Long id, UsuarioEntradaDTO dto) {
    Usuario usuario = buscar(id);
    usuario.setNombre(dto.nombre());
    usuario.setEmail(dto.email());
    usuario.setRol(dto.rol());
    usuario.setActivo(dto.activo());
    return UsuarioMapper.toDto(usuarioRepository.save(usuario));
  }

  /** Autoedición: el usuario autenticado cambia su propio nombre (resuelto por su email). */
  public UsuarioSalidaDTO actualizarPerfil(String email, PerfilUsuarioDTO dto) {
    Usuario usuario =
        usuarioRepository
            .findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", email));
    usuario.setNombre(dto.nombre());
    return UsuarioMapper.toDto(usuario);
  }

  /** Baja lógica: desactiva la cuenta (no se borra la fila). */
  public void eliminar(Long id) {
    Usuario usuario = buscar(id);
    usuario.setActivo(false);
  }

  private Usuario buscar(Long id) {
    return usuarioRepository
        .findById(id)
        .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));
  }
}
