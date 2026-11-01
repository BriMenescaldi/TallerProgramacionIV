package com.taller4.sistematurnos.dto;

public record ProfesionalSalidaDTO(
    Long id, UsuarioSalidaDTO usuario, String especialidad, String bio, String telefono) {}
