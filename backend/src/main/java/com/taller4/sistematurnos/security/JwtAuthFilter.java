package com.taller4.sistematurnos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Lee el header {@code Authorization: Bearer <token>}, valida la firma y, si es válido, autentica
 * la request poblando el SecurityContext con el rol como authority {@code ROLE_<rol>}.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  public JwtAuthFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      try {
        Claims claims = jwtService.parsear(token);
        String email = claims.getSubject();
        String rol = claims.get("rol", String.class);
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + rol));
        var auth = new UsernamePasswordAuthenticationToken(email, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);
      } catch (JwtException ex) {
        // Token inválido o expirado: seguimos sin autenticar; Security devolverá 401 si hace falta.
        SecurityContextHolder.clearContext();
      }
    }
    filterChain.doFilter(request, response);
  }
}
