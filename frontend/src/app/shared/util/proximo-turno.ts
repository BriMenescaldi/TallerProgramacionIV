import type { TurnoSalidaDTO } from '../../core/api/generated/model';

export function proximoTurno(
  turnos: readonly TurnoSalidaDTO[],
  ahora: Date = new Date(),
): TurnoSalidaDTO | null {
  return (
    turnos
      .filter((t) => t.estado !== 'CANCELADO' && t.fechaHora && new Date(t.fechaHora) > ahora)
      .sort((a, b) => new Date(a.fechaHora!).getTime() - new Date(b.fechaHora!).getTime())[0] ??
    null
  );
}
