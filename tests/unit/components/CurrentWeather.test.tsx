import { render, screen } from '@testing-library/react';
import CurrentWeather from '../../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../../src/types/weather';

const city: City = {
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.5505,
  longitude: -46.6333,
};

const current: CurrentWeatherData = {
  temperatureC: 22.4,
  weatherCode: 2,
  humidityPercent: 64,
  windSpeedKmh: 12.5,
  precipitationMm: 0.1,
  pressureHpa: 1013.2,
};

describe('CurrentWeather', () => {
  it('renders the city, current condition, temperature, and metric units', () => {
    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'São Paulo, Brasil' })).toBeVisible();
    expect(screen.getByText('22,4 °C')).toBeVisible();
    expect(screen.getByText('Parcialmente nublado')).toBeVisible();
    expect(screen.getByText('64%')).toBeVisible();
    expect(screen.getByText('12,5 km/h')).toBeVisible();
    expect(screen.getByText('0,1 mm')).toBeVisible();
    expect(screen.getByText('1.013,2 hPa')).toBeVisible();
  });

  it('formats the temperature in the selected unit', () => {
    render(<CurrentWeather city={city} current={current} unit="fahrenheit" />);

    expect(screen.getByText('72,3 °F')).toBeVisible();
  });

  it('shows unavailable labels when values are absent or the code is unknown', () => {
    render(
      <CurrentWeather
        city={city}
        current={{ temperatureC: undefined, weatherCode: 999 }}
        unit="celsius"
      />,
    );

    expect(screen.getAllByText('Indisponível')).toHaveLength(5);
    expect(screen.getByText('Condição: Indisponível')).toBeVisible();
    expect(screen.queryByText('999')).not.toBeInTheDocument();
  });
});
