import { render, screen, within } from '@testing-library/react';
import ForecastList from '../../../src/components/ForecastList';
import type { ForecastDay } from '../../../src/types/weather';

const forecast: ForecastDay[] = [
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
];

describe('ForecastList', () => {
  it('shows safe fallbacks for invalid dates and non-finite numeric values', () => {
    render(
      <ForecastList
        forecast={[
          {
            date: '2026-02-30',
            temperatureMaxC: Number.NaN,
            temperatureMinC: Number.POSITIVE_INFINITY,
            weatherCode: 999,
            precipitationProbabilityPercent: Number.NaN,
          },
        ]}
        unit="celsius"
      />,
    );

    expect(screen.getByRole('article')).not.toHaveTextContent(/NaN|undefined|Infinity|∞/);
    expect(screen.getByRole('heading', { name: 'Data indisponível' })).toBeVisible();
    expect(screen.getByText('Máx. Indisponível')).toBeVisible();
    expect(screen.getByText('Mín. Indisponível')).toBeVisible();
    expect(screen.getByText('Chuva: Indisponível')).toBeVisible();
    expect(screen.getByRole('img', { name: 'Condição indisponível' })).toBeVisible();
  });

  it('renders each forecast day with condition, temperatures, and rain probability', () => {
    render(<ForecastList forecast={forecast} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByText('Máx. 25,1 °C')).toBeVisible();
    expect(screen.getByText('Mín. 17,8 °C')).toBeVisible();
    expect(screen.getByText('Chuva: 10%')).toBeVisible();
    expect(
      within(screen.getAllByRole('article')[0]).getByRole('img', {
        name: 'Parcialmente nublado',
      }),
    ).toBeVisible();
  });

  it('formats maximum and minimum temperatures in the selected unit', () => {
    render(<ForecastList forecast={[forecast[0]]} unit="fahrenheit" />);

    expect(screen.getByText('Máx. 77,2 °F')).toBeVisible();
    expect(screen.getByText('Mín. 64 °F')).toBeVisible();
  });

  it('shows missing fields as unavailable without inferring values', () => {
    render(
      <ForecastList
        forecast={[
          {
            date: '2026-10-27',
          },
        ]}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Máx. Indisponível')).toBeVisible();
    expect(screen.getByText('Mín. Indisponível')).toBeVisible();
    expect(screen.getByText('Chuva: Indisponível')).toBeVisible();
    expect(screen.getByRole('img', { name: 'Condição indisponível' })).toBeVisible();
  });

  it('renders an empty state when there are no forecast days', () => {
    render(<ForecastList forecast={[]} unit="celsius" />);

    expect(screen.getByText('Previsão indisponível')).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('announces partial coverage without creating missing days', () => {
    render(<ForecastList forecast={forecast.slice(0, 2)} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Previsão parcial: 2 de 5 dias disponíveis.',
    );
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('labels cards with the localized weekday', () => {
    render(<ForecastList forecast={[forecast[0]]} unit="celsius" />);

    const article = screen.getByRole('article');
    expect(within(article).getByRole('heading', { name: 'Ter' })).toBeVisible();
  });
});
