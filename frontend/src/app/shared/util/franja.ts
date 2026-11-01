import type { DisponibilidadSalidaDTODiaSemana } from '../../core/api/generated/model';

/** Día de la semana de la franja → índice de `Date.getDay()` (0 = domingo). */
const DIA_A_JS: Record<DisponibilidadSalidaDTODiaSemana, number> = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

/** true si la fecha cae en el día de semana de la franja (para filtrar el datepicker). */
export function esDiaDeFranja(fecha: Date, dia: DisponibilidadSalidaDTODiaSemana): boolean {
  return fecha.getDay() === DIA_A_JS[dia];
}

/**
 * Combina un día (Date, hora ignorada) con una hora "HH:mm[:ss]" en un
 * LocalDateTime local "yyyy-MM-ddTHH:mm:ss" que entiende el backend. Se arma con
 * los componentes locales de la fecha (no UTC) para no correr el día por zona horaria.
 */
export function combinarFechaHora(fecha: Date, hora: string): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  const horaCompleta = hora.length === 5 ? `${hora}:00` : hora;
  return `${y}-${m}-${d}T${horaCompleta}`;
}
