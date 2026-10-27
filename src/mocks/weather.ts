import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    admin1: 'São Paulo',
    country: 'Brasil',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
  },
  current: {
    temperatureC: 22.4,
    weatherCode: 2,
    humidityPercent: 64,
    windSpeedKmh: 12.5,
    precipitationMm: 0.1,
    pressureHpa: 1013.2,
  },
  forecast: [
    {
      date: '2026-10-27',
      temperatureMaxC: 25.1,
      temperatureMinC: 17.8,
      weatherCode: 2,
      precipitationProbabilityPercent: 10,
    },
    {
      date: '2026-10-28',
      temperatureMaxC: 24.3,
      temperatureMinC: 18.2,
      weatherCode: 3,
      precipitationProbabilityPercent: 20,
    },
    {
      date: '2026-10-29',
      temperatureMaxC: 21.7,
      temperatureMinC: 16.9,
      weatherCode: 61,
      precipitationProbabilityPercent: 80,
    },
    {
      date: '2026-10-30',
      temperatureMaxC: 23.8,
      temperatureMinC: 17.1,
      weatherCode: 2,
      precipitationProbabilityPercent: 15,
    },
    {
      date: '2026-10-31',
      temperatureMaxC: 26.2,
      temperatureMinC: 18.5,
      weatherCode: 1,
      precipitationProbabilityPercent: 5,
    },
  ],
};
