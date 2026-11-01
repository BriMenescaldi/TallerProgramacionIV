package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.PerfilProfesionalDTO;
import com.taller4.sistematurnos.dto.ProfesionalEntradaDTO;
import com.taller4.sistematurnos.dto.ProfesionalSalidaDTO;
import com.taller4.sistematurnos.entity.Profesional;
import com.taller4.sistematurnos.entity.Rol;
import com.taller4.sistematurnos.entity.Usuario;
import com.taller4.sistematurnos.exception.RecursoNoEncontradoException;
import com.taller4.sistematurnos.exception.ValidacionException;
import com.taller4.sistematurnos.mapper.ProfesionalMapper;
import com.taller4.sistematurnos.repository.ProfesionalRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** ABM de profesionales. Crea en cascada la cuenta Usuario (rol PROFESIONAL, password hasheada). */
@Service
@Transactional
public class ProfesionalService {

  private final ProfesionalRepository profesionalRepository;
  private final PasswordEncoder passwordEncoder;

  public ProfesionalService(
      ProfesionalRepository profesionalRepository, PasswordEncoder passwordEncoder) {
    this.profesionalRepository = profesionalRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional(readOnly = true)
  public List<ProfesionalSalidaDTO> listar() {
    return profesionalRepository.findAll().stream().map(ProfesionalMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public ProfesionalSalidaDTO obtener(Long id) {
    return ProfesionalMapper.toDto(buscar(id));
  }

  /** Resuelve el profesional del usuario autenticado a partir de su email (endpoint /me). */
  @Transactional(readOnly = true)
  public ProfesionalSalidaDTO obtenerPorEmail(String email) {
    return ProfesionalMapper.toDto(
        profesionalRepository
            .findByUsuarioEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Profesional", email)));
  }

  public ProfesionalSalidaDTO crear(ProfesionalEntradaDTO dto) {
    if (dto.password() == null || dto.password().isBlank()) {
      throw new ValidacionException("La contraseña es obligatoria para crear un profesional");
    }
    Profesional profesional = ProfesionalMapper.toEntity(dto);
    Usuario usuario = profesional.getUsuario();
    usuario.setPasswordHash(passwordEncoder.encode(dto.password()));
    usuario.setRol(Rol.PROFESIONAL);
    return ProfesionalMapper.toDto(profesionalRepository.save(profesional));
  }

  /** Autoedición: el profesional autenticado edita sus campos propios (resuelto por su email). */
  public ProfesionalSalidaDTO actualizarMiPerfil(String email, PerfilProfesionalDTO dto) {
    Profesional profesional =
        profesionalRepository
            .findByUsuarioEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Profesional", email));
    profesional.setEspecialidad(dto.especialidad());
    profesional.setBio(dto.bio());
    profesional.setTelefono(dto.telefono());
    return ProfesionalMapper.toDto(profesional);
  }

  public ProfesionalSalidaDTO actualizar(Long id, ProfesionalEntradaDTO dto) {
    Profesional profesional = buscar(id);
    profesional.setEspecialidad(dto.especialidad());
    profesional.setBio(dto.bio());
    profesional.setTelefono(dto.telefono());

    if (profesional.getUsuario() != null && dto.usuario() != null) {
      profesional.getUsuario().setNombre(dto.usuario().nombre());
      profesional.getUsuario().setEmail(dto.usuario().email());
      profesional.getUsuario().setActivo(dto.usuario().activo());
    }
    return ProfesionalMapper.toDto(profesionalRepository.save(profesional));
  }

  public void eliminar(Long id) {
    profesionalRepository.delete(buscar(id));
  }

  private Profesional buscar(Long id) {
    return profesionalRepository
        .findById(id)
        .orElseThrow(() -> new RecursoNoEncontradoException("Profesional", id));
  }
}
