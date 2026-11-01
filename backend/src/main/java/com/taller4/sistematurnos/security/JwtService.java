package com.taller4.sistematurnos.security;

import com.taller4.sistematurnos.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Genera y valida JWT firmados con HMAC. El token lleva el email como subject y el rol como claim;
 * nunca datos sensibles (es legible, solo está firmado).
 */
@Service
public class JwtService {

  private final SecretKey key;
  private final long expirationMs;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.expiration-ms}") long expirationMs) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.expirationMs = expirationMs;
  }

  public String generar(Usuario usuario) {
    Date ahora = new Date();
    return Jwts.builder()
        .subject(usuario.getEmail())
        .claim("rol", usuario.getRol().name())
        .issuedAt(ahora)
        .expiration(new Date(ahora.getTime() + expirationMs))
        .signWith(key)
        .compact();
  }

  /** Devuelve los claims si el token es válido (firma y expiración); lanza si no lo es. */
  public Claims parsear(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
  }
}
