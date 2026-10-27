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
  id?: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
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
    typeof value.latitude === 'number' &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === 'number' &&
    Number.isFinite(value.longitude) &&
    (value.id === undefined || typeof value.id === 'number') &&
    (value.admin1 === undefined || typeof value.admin1 === 'string') &&
    (value.country === undefined || typeof value.country === 'string') &&
    (value.timezone === undefined || typeof value.timezone === 'string')
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

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (isRecord(error) && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.');
    }

    throw new WeatherServiceError('Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseJsonResponse(response: Response, description: string): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new WeatherServiceError(`A resposta de ${description} é inválida.`);
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

  const response = await fetchWithTimeout(
    `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmedName)}&language=pt`,
  );
  if (!response.ok) {
    throw new WeatherServiceError(
      `A busca de cidades falhou (HTTP ${response.status}).`,
      response.status,
    );
  }

  const data = await parseJsonResponse(response, 'geocodificação');

  if (!isRecord(data)) {
    throw new WeatherServiceError('A resposta de geocodificação é inválida.');
  }

  const results = data.results;
  if (results === undefined) {
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
      id,
      name: cityName,
      admin1,
      country,
      latitude,
      longitude,
      timezone,
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
  const response = await fetchWithTimeout(`${FORECAST_API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new WeatherServiceError(
      `A consulta meteorológica falhou (HTTP ${response.status}).`,
      response.status,
    );
  }

  const data = await parseJsonResponse(response, 'previsão meteorológica');
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
