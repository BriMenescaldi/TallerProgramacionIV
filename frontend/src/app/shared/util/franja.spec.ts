import { combinarFechaHora, esDiaDeFranja } from './franja';

describe('esDiaDeFranja', () => {
  it('acepta una fecha que cae en el día de la franja', () => {
    // 2026-07-21 es martes
    expect(esDiaDeFranja(new Date(2026, 6, 21), 'MARTES')).toBe(true);
  });

  it('rechaza una fecha que no cae en el día de la franja', () => {
    expect(esDiaDeFranja(new Date(2026, 6, 21), 'LUNES')).toBe(false);
  });

  it('mapea DOMINGO al índice 0', () => {
    // 2026-07-19 es domingo
    expect(esDiaDeFranja(new Date(2026, 6, 19), 'DOMINGO')).toBe(true);
  });
});

describe('combinarFechaHora', () => {
  it('arma el LocalDateTime con componentes locales y hora "HH:mm:ss"', () => {
    expect(combinarFechaHora(new Date(2026, 6, 21), '09:00:00')).toBe('2026-07-21T09:00:00');
  });

  it('completa los segundos cuando la hora viene como "HH:mm"', () => {
    expect(combinarFechaHora(new Date(2026, 0, 5), '14:30')).toBe('2026-01-05T14:30:00');
  });
});
