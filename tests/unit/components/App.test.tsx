import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../src/App';
import { getWeather, searchCities } from '../../../src/services/weatherService';
import type { City, WeatherData } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const city: City = {
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
};

const weatherData: WeatherData = {
  city,
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
  ],
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts idle and renders weather after a successful search', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities).mockResolvedValue([city]);
    vi.mocked(getWeather).mockResolvedValue(weatherData);
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'O tempo da sua cidade, em um só lugar' }),
    ).toBeVisible();

    const searchbox = screen.getByRole('searchbox', { name: 'Buscar cidade' });
    await user.type(searchbox, 'São Paulo');
    await user.keyboard('{Enter}');

    expect(await screen.findByText('22,4 °C')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
    expect(screen.getByText('Previsão carregada para São Paulo.')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('renders loading while the city search is pending', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities).mockImplementation(() => new Promise(() => {}));
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('status')).toHaveTextContent('Buscando previsão para Lisboa');
  });

  it('renders the empty state when no city matches', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities).mockResolvedValue([]);
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Cidade inexistente');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(
      await screen.findByRole('heading', {
        name: 'Nenhuma cidade encontrada para "Cidade inexistente"',
      }),
    ).toBeVisible();
  });

  it('renders errors and retries the failed request', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce([city]);
    vi.mocked(getWeather).mockResolvedValue(weatherData);
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha de rede.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('22,4 °C')).toBeVisible();
    expect(searchCities).toHaveBeenCalledTimes(2);
  });

  it('updates current and forecast temperatures when the unit changes', async () => {
    const user = userEvent.setup();
    vi.mocked(searchCities).mockResolvedValue([city]);
    vi.mocked(getWeather).mockResolvedValue(weatherData);
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await screen.findByText('22,4 °C');

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('72,3 °F')).toBeVisible();
    expect(screen.getByText('Máx. 77,2 °F')).toBeVisible();
  });
});
