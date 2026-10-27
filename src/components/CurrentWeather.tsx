import { useId } from 'react';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <dt className="text-sm text-white/70">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-white">{value}</dd>
    </div>
  );
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const titleId = useId();
  const condition = getWeatherCondition(current.weatherCode);
  const unavailable = 'Indisponível';
  const formatMetric = (value: number | undefined, unitLabel: string) =>
    typeof value !== 'number' || !Number.isFinite(value)
      ? unavailable
      : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} ${unitLabel}`;

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md sm:p-8"
    >
      <div className="text-center">
        <h2 id={titleId} className="text-lg font-medium text-white/80">
          {city.name}
          {city.admin1 && city.admin1 !== city.name ? `, ${city.admin1}` : ''}
          {city.country ? `, ${city.country}` : ''}
        </h2>
        <p className="mt-1 text-sm text-white/60">Clima atual</p>

        <p className="mt-4 text-6xl font-bold tracking-tight text-white sm:text-7xl">
          {formatTemperature(current.temperatureC, unit)}
        </p>

        <div className="mt-3 flex items-center justify-center gap-3 text-white">
          {condition ? (
            <>
              <span aria-hidden="true" className="text-4xl">
                {condition.icon}
              </span>
              <span className="text-lg">{condition.description}</span>
            </>
          ) : (
            <span className="text-base text-white/70">Condição: {unavailable}</span>
          )}
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric
          label="Umidade"
          value={
            typeof current.humidityPercent !== 'number' || !Number.isFinite(current.humidityPercent)
              ? unavailable
              : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(current.humidityPercent)}%`
          }
        />
        <Metric label="Vento" value={formatMetric(current.windSpeedKmh, 'km/h')} />
        <Metric label="Precipitação" value={formatMetric(current.precipitationMm, 'mm')} />
        <Metric label="Pressão" value={formatMetric(current.pressureHpa, 'hPa')} />
      </dl>
    </section>
  );
}
