import type { TurnoSalidaDTO } from '../../core/api/generated/model';
import { proximoTurno } from './proximo-turno';

function turno(
  id: number,
  fechaHora: string,
  estado: TurnoSalidaDTO['estado'] = 'PENDIENTE',
): TurnoSalidaDTO {
  return { id, fechaHora, estado };
}

describe('proximoTurno', () => {
  const ahora = new Date('2026-06-26T12:00:00');

  it('devuelve null si no hay turnos', () => {
    expect(proximoTurno([], ahora)).toBeNull();
  });

  it('ignora turnos pasados', () => {
    expect(proximoTurno([turno(1, '2026-06-25T10:00:00')], ahora)).toBeNull();
  });

  it('ignora turnos cancelados aunque sean futuros', () => {
    expect(proximoTurno([turno(1, '2026-06-27T10:00:00', 'CANCELADO')], ahora)).toBeNull();
  });

  it('devuelve el futuro más próximo ordenando por fecha', () => {
    const turnos = [
      turno(1, '2026-06-29T10:00:00'),
      turno(2, '2026-06-27T09:00:00'),
      turno(3, '2026-06-28T08:00:00'),
    ];
    expect(proximoTurno(turnos, ahora)?.id).toBe(2);
  });
});
