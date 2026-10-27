import { formatDayLabel } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const condition = getWeatherCondition(day.weatherCode);
  const rainProbability =
    day.precipitationProbabilityPercent === undefined
      ? 'Indisponível'
      : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(day.precipitationProbabilityPercent)}%`;

  return (
    <article
      aria-label={`Previsão para ${formatDayLabel(day.date)}`}
      className="flex min-h-52 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-glass backdrop-blur-md"
    >
      <h3 className="font-semibold capitalize text-white">{formatDayLabel(day.date)}</h3>
      {condition ? (
        <span aria-label={condition.description} role="img" className="mt-3 text-3xl">
          {condition.icon}
        </span>
      ) : (
        <span aria-label="Condição indisponível" role="img" className="mt-3 text-3xl text-white/60">
          —
        </span>
      )}
      <div className="mt-3 flex w-full flex-col items-center gap-1 text-xs leading-tight sm:text-sm">
        <span className="max-w-full break-words font-semibold text-white">
          Máx. {formatTemperature(day.temperatureMaxC, unit)}
        </span>
        <span className="max-w-full break-words text-white/70">
          Mín. {formatTemperature(day.temperatureMinC, unit)}
        </span>
      </div>
      <p className="mt-auto pt-3 text-sm text-white/70">Chuva: {rainProbability}</p>
    </article>
  );
}
