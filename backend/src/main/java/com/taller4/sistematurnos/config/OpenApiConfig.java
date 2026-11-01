package com.taller4.sistematurnos.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Declara el esquema de seguridad bearer/JWT para OpenAPI. Habilita el botón "Authorize" en Swagger
 * y hace que el cliente generado por orval sepa que los endpoints esperan el token.
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(title = "Sistema de Turnos API", version = "v1"),
    security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT")
public class OpenApiConfig {}
