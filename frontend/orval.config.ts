import { defineConfig } from 'orval';

/**
 * orval: genera el cliente HTTP y los tipos TypeScript del frontend a partir del
 * esquema OpenAPI que expone el backend Spring Boot.
 *
 * Uso: con el backend corriendo (./gradlew bootRun), ejecutar `npm run gen:api`.
 * Re-generar cada vez que cambien los DTOs/endpoints del backend: una sola fuente
 * de verdad (Java) -> tipos y servicios TS al día, sin duplicar nada a mano.
 */
export default defineConfig({
  sistematurnos: {
    input: {
      target: 'http://localhost:8080/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      client: 'angular',
      target: 'src/app/core/api/generated',
      schemas: 'src/app/core/api/generated/model',
      clean: true,
      prettier: true,
    },
  },
});
