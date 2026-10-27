export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id?: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  temperatureC?: number;
  weatherCode?: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
  pressureHpa?: number;
}

export interface ForecastDay {
  date: string;
  temperatureMaxC?: number;
  temperatureMinC?: number;
  weatherCode?: number;
  precipitationProbabilityPercent?: number;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
