import { Component, inject, signal } from '@angular/core';

import { HealthService } from '../../core/api/generated/health/health.service';
import type { HealthStatus } from '../../core/api/generated/model';

/**
 * Pantalla de diagnóstico: consume GET /api/health a través del servicio
 * generado por orval (tipos derivados del backend Spring Boot, sin duplicar).
 * Sirve para verificar que todo el stack está conectado.
 */
@Component({
  selector: 'app-health',
  imports: [],
  templateUrl: './health.html',
  styleUrl: './health.scss',
})
export class Health {
  private readonly healthService = inject(HealthService);

  protected readonly status = signal<HealthStatus | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  constructor() {
    this.check();
  }

  check(): void {
    this.loading.set(true);
    this.error.set(null);
    this.healthService.health().subscribe({
      next: (status) => {
        this.status.set(status);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'No se pudo contactar al backend');
        this.loading.set(false);
      },
    });
  }
}
