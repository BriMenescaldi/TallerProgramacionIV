package com.taller4.sistematurnos.dto;

/** Respuesta de login/registro: el JWT firmado y los datos públicos del usuario. */
public record AuthRespuestaDTO(String token, UsuarioSalidaDTO usuario) {}
