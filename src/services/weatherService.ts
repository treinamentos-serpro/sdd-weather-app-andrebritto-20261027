import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;
const CURRENT_WEATHER_FIELDS = [
  'temperature_2m',
  'weather_code',
  'relative_humidity_2m',
  'wind_speed_10m',
  'precipitation',
  'surface_pressure',
].join(',');
const DAILY_WEATHER_FIELDS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'weather_code',
  'precipitation_probability_max',
].join(',');

interface GeocodingResult {
  id?: number | null;
  name: string;
  admin1?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  timezone?: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isGeocodingResult(value: unknown): value is GeocodingResult {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.latitude === 'number' &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === 'number' &&
    Number.isFinite(value.longitude) &&
    (value.id == null || (typeof value.id === 'number' && Number.isFinite(value.id))) &&
    (value.admin1 == null || typeof value.admin1 === 'string') &&
    (value.country == null || typeof value.country === 'string') &&
    (value.timezone == null || typeof value.timezone === 'string')
  );
}

function getOptionalNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function getOptionalArrayValue(values: unknown, index: number): number | undefined {
  if (!Array.isArray(values)) {
    return undefined;
  }

  const value: unknown = values[index];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

async function fetchWithTimeout(
  url: string,
  description: string,
  httpErrorMessage: string,
): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new WeatherServiceError(
        `${httpErrorMessage} (HTTP ${response.status}).`,
        response.status,
      );
    }

    return await response.json();
  } catch (error) {
    if (controller.signal.aborted || (isRecord(error) && error.name === 'AbortError')) {
      throw new WeatherServiceError('A requisição demorou demais.');
    }
    if (error instanceof WeatherServiceError) {
      throw error;
    }
    if (error instanceof SyntaxError) {
      throw new WeatherServiceError(`A resposta de ${description} é inválida.`);
    }
    if (error instanceof TypeError) {
      throw new WeatherServiceError('Falha de rede.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export class WeatherServiceError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'WeatherServiceError';
    this.status = status;
  }
}

export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return [];
  }

  const data = await fetchWithTimeout(
    `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmedName)}&language=pt`,
    'geocodificação',
    'A busca de cidades falhou',
  );

  if (!isRecord(data)) {
    throw new WeatherServiceError('A resposta de geocodificação é inválida.');
  }

  const results = data.results;
  if (results == null) {
    return [];
  }
  if (!Array.isArray(results)) {
    throw new WeatherServiceError('A resposta de geocodificação é inválida.');
  }

  return results.map((result: unknown) => {
    if (!isGeocodingResult(result)) {
      throw new WeatherServiceError('A resposta de geocodificação é inválida.');
    }

    const { id, name: cityName, admin1, country, latitude, longitude, timezone } = result;
    return {
      id: id ?? undefined,
      name: cityName,
      admin1: admin1?.trim() || undefined,
      country: country?.trim() || undefined,
      latitude,
      longitude,
      timezone: timezone?.trim() || undefined,
    };
  });
}

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: CURRENT_WEATHER_FIELDS,
    daily: DAILY_WEATHER_FIELDS,
    forecast_days: '5',
    timezone: 'auto',
    temperature_unit: 'celsius',
  });
  const data = await fetchWithTimeout(
    `${FORECAST_API_URL}?${params.toString()}`,
    'previsão meteorológica',
    'A consulta meteorológica falhou',
  );
  if (!isRecord(data) || !isRecord(data.current) || !isRecord(data.daily)) {
    throw new WeatherServiceError('A resposta meteorológica está incompleta.');
  }

  const currentResponse = data.current;
  const current: CurrentWeather = {
    temperatureC: getOptionalNumber(currentResponse, 'temperature_2m'),
    weatherCode: getOptionalNumber(currentResponse, 'weather_code'),
    humidityPercent: getOptionalNumber(currentResponse, 'relative_humidity_2m'),
    windSpeedKmh: getOptionalNumber(currentResponse, 'wind_speed_10m'),
    precipitationMm: getOptionalNumber(currentResponse, 'precipitation'),
    pressureHpa: getOptionalNumber(currentResponse, 'surface_pressure'),
  };

  const dailyResponse = data.daily;
  if (!Array.isArray(dailyResponse.time)) {
    throw new WeatherServiceError('A resposta meteorológica está incompleta.');
  }

  const forecast: ForecastDay[] = dailyResponse.time.slice(0, 5).map((date: unknown, index) => {
    if (typeof date !== 'string') {
      throw new WeatherServiceError('A resposta meteorológica está incompleta.');
    }

    return {
      date,
      temperatureMaxC: getOptionalArrayValue(dailyResponse.temperature_2m_max, index),
      temperatureMinC: getOptionalArrayValue(dailyResponse.temperature_2m_min, index),
      weatherCode: getOptionalArrayValue(dailyResponse.weather_code, index),
      precipitationProbabilityPercent: getOptionalArrayValue(
        dailyResponse.precipitation_probability_max,
        index,
      ),
    };
  });

  return { city, current, forecast };
}
