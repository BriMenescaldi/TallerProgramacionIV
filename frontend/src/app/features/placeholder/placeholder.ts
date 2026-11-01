import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Pantalla temporal del baseline (ticket 1). El árbol de rutas y los guards ya
 * están armados; cada ruta apunta acá hasta que los tickets 2-6 la reemplacen
 * por la pantalla real.
 */
@Component({
  selector: 'app-placeholder',
  template: `<p>
    Pantalla en construcción: <code>{{ ruta }}</code>
  </p>`,
})
export class Placeholder {
  protected readonly ruta =
    inject(ActivatedRoute)
      .snapshot.pathFromRoot.flatMap((r) => r.url.map((s) => s.path))
      .join('/') || '(home)';
}
