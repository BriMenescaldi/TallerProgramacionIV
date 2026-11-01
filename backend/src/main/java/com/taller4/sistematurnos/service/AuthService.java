package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.AuthRespuestaDTO;
import com.taller4.sistematurnos.dto.LoginDTO;
import com.taller4.sistematurnos.dto.RegistroDTO;
import com.taller4.sistematurnos.entity.Rol;
import com.taller4.sistematurnos.entity.Usuario;
import com.taller4.sistematurnos.exception.CredencialesInvalidasException;
import com.taller4.sistematurnos.exception.EmailYaRegistradoException;
import com.taller4.sistematurnos.mapper.UsuarioMapper;
import com.taller4.sistematurnos.repository.UsuarioRepository;
import com.taller4.sistematurnos.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Registro de clientes y login. Hashea con BCrypt y emite el JWT. */
@Service
@Transactional
public class AuthService {

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthRespuestaDTO registrar(RegistroDTO dto) {
    if (usuarioRepository.existsByEmail(dto.email())) {
      throw new EmailYaRegistradoException(dto.email());
    }
    Usuario usuario = new Usuario();
    usuario.setNombre(dto.nombre());
    usuario.setEmail(dto.email());
    usuario.setPasswordHash(passwordEncoder.encode(dto.password()));
    usuario.setRol(Rol.CLIENTE);
    usuario.setActivo(true);
    Usuario guardado = usuarioRepository.save(usuario);
    return new AuthRespuestaDTO(jwtService.generar(guardado), UsuarioMapper.toDto(guardado));
  }

  @Transactional(readOnly = true)
  public AuthRespuestaDTO login(LoginDTO dto) {
    Usuario usuario =
        usuarioRepository
            .findByEmail(dto.email())
            .orElseThrow(() -> new CredencialesInvalidasException("Email o password incorrectos"));
    if (!usuario.isActivo()
        || !passwordEncoder.matches(dto.password(), usuario.getPasswordHash())) {
      throw new CredencialesInvalidasException("Email o password incorrectos");
    }
    return new AuthRespuestaDTO(jwtService.generar(usuario), UsuarioMapper.toDto(usuario));
  }
}
