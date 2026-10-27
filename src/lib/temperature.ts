import type { Unit } from '../types/weather';

export function convertTemperature(temperatureC: number, unit: Unit): number {
  return unit === 'celsius' ? temperatureC : (temperatureC * 9) / 5 + 32;
}

export function unitLabel(unit: Unit): string {
  return unit === 'celsius' ? '°C' : '°F';
}

export function formatTemperature(temperatureC: number | undefined, unit: Unit): string {
  if (typeof temperatureC !== 'number' || !Number.isFinite(temperatureC)) {
    return 'Indisponível';
  }

  const temperature = convertTemperature(temperatureC, unit);
  if (!Number.isFinite(temperature)) {
    return 'Indisponível';
  }

  const formattedTemperature = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(temperature);

  return `${formattedTemperature} ${unitLabel(unit)}`;
}
