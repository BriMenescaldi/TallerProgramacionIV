package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.ServicioEntradaDTO;
import com.taller4.sistematurnos.dto.ServicioSalidaDTO;
import com.taller4.sistematurnos.entity.Servicio;
import com.taller4.sistematurnos.exception.RecursoNoEncontradoException;
import com.taller4.sistematurnos.mapper.ServicioMapper;
import com.taller4.sistematurnos.repository.ServicioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** ABM de servicios. */
@Service
@Transactional
public class ServicioService {

  private final ServicioRepository servicioRepository;

  public ServicioService(ServicioRepository servicioRepository) {
    this.servicioRepository = servicioRepository;
  }

  @Transactional(readOnly = true)
  public List<ServicioSalidaDTO> listar() {
    return servicioRepository.findAll().stream().map(ServicioMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public ServicioSalidaDTO obtener(Long id) {
    return ServicioMapper.toDto(buscar(id));
  }

  public ServicioSalidaDTO crear(ServicioEntradaDTO dto) {
    Servicio servicio = ServicioMapper.toEntity(dto);
    return ServicioMapper.toDto(servicioRepository.save(servicio));
  }

  public ServicioSalidaDTO actualizar(Long id, ServicioEntradaDTO dto) {
    Servicio servicio = buscar(id);
    servicio.setNombre(dto.nombre());
    servicio.setDescripcion(dto.descripcion());
    servicio.setDuracionMin(dto.duracionMin());
    servicio.setPrecio(dto.precio());
    return ServicioMapper.toDto(servicioRepository.save(servicio));
  }

  public void eliminar(Long id) {
    servicioRepository.delete(buscar(id));
  }

  private Servicio buscar(Long id) {
    return servicioRepository
        .findById(id)
        .orElseThrow(() -> new RecursoNoEncontradoException("Servicio", id));
  }
}
