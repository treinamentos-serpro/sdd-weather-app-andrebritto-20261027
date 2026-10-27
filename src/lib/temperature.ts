import type { Unit } from '../types/weather';

export function formatTemperature(temperatureC: number | undefined, unit: Unit): string {
  if (temperatureC === undefined) {
    return 'Indisponível';
  }

  const temperature = unit === 'celsius' ? temperatureC : (temperatureC * 9) / 5 + 32;
  const formattedTemperature = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(temperature);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  return `${formattedTemperature} ${unitSymbol}`;
}
