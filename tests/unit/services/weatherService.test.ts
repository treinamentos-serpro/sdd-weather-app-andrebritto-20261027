import {
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

const city: City = {
  id: 1,
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

describe('weatherService', () => {
  it('normalizes nullable optional city fields without rejecting a valid city', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ ...city, id: null, admin1: null, country: null, timezone: null }],
        }),
      }),
    );

    await expect(searchCities('São Paulo')).resolves.toEqual([
      { ...city, id: undefined, admin1: undefined, country: undefined, timezone: undefined },
    ]);
  });

  it('treats null geocoding results as no cities', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: null }) }),
    );

    await expect(searchCities('Cidade')).resolves.toEqual([]);
  });

  it.each([
    { ...city, name: null },
    { ...city, name: ' ' },
    { ...city, latitude: null },
    { ...city, longitude: undefined },
  ])('rejects unusable city identity or coordinates: %j', async (result) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [result] }) }),
    );

    await expect(searchCities('Cidade')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('keeps parallel daily indexes when arrays contain null or missing values', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: null,
            weather_code: null,
            relative_humidity_2m: null,
            wind_speed_10m: null,
            precipitation: null,
            surface_pressure: null,
          },
          daily: {
            time: ['2026-10-27', '2026-10-28'],
            temperature_2m_max: [null, 20],
            temperature_2m_min: null,
            weather_code: [null, 0],
            precipitation_probability_max: [null],
          },
        }),
      }),
    );

    const data = await getWeather(city);
    expect(data.current).toEqual({
      temperatureC: undefined,
      weatherCode: undefined,
      humidityPercent: undefined,
      windSpeedKmh: undefined,
      precipitationMm: undefined,
      pressureHpa: undefined,
    });
    expect(data.forecast).toEqual([
      {
        date: '2026-10-27',
        temperatureMaxC: undefined,
        temperatureMinC: undefined,
        weatherCode: undefined,
        precipitationProbabilityPercent: undefined,
      },
      {
        date: '2026-10-28',
        temperatureMaxC: 20,
        temperatureMinC: undefined,
        weatherCode: 0,
        precipitationProbabilityPercent: undefined,
      },
    ]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it.each(['', '   ', '\t\n'])('does not call fetch for blank input %j', async (input) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities(input)).resolves.toEqual([]);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes the trimmed name and maps geocoding results to cities', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            admin1: 'São Paulo',
            country: 'Brasil',
            latitude: -23.55,
            longitude: -46.63,
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('  São Paulo & região  ')).resolves.toEqual([
      {
        id: 3448439,
        name: 'São Paulo',
        admin1: 'São Paulo',
        country: 'Brasil',
        latitude: -23.55,
        longitude: -46.63,
        timezone: 'America/Sao_Paulo',
      },
    ]);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo%20%26%20regi%C3%A3o&language=pt',
    );
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('returns an empty list when the API has no matching results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );

    await expect(searchCities('Cidade inexistente')).resolves.toEqual([]);
  });

  it('throws WeatherServiceError when the response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });
    vi.stubGlobal('fetch', fetchMock);
    const search = searchCities('São Paulo');

    await expect(search).rejects.toMatchObject({
      name: 'WeatherServiceError',
      status: 503,
    });
    await expect(search).rejects.toBeInstanceOf(WeatherServiceError);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('throws WeatherServiceError when the results payload is invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [{ name: 'Cidade sem coordenadas' }] }),
      }),
    );

    await expect(searchCities('Cidade')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('converts an aborted request to a timeout error and clears the timer', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = searchCities('São Paulo');
    const rejection = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A requisição demorou demais.',
    });
    await vi.advanceTimersByTimeAsync(10_000);

    await rejection;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('converts network failures to WeatherServiceError and clears the timer', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')));

    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps the timeout active while reading the response body', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) =>
        Promise.resolve({
          ok: true,
          json: () =>
            new Promise((_resolve, reject) => {
              init?.signal?.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'));
              });
            }),
        }),
      ),
    );
    const request = searchCities('São Paulo');
    const rejection = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A requisição demorou demais.',
    });

    await vi.advanceTimersByTimeAsync(9_999);
    expect(vi.getTimerCount()).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    await rejection;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reports a network failure during body reading instead of invalid JSON', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new TypeError('Connection lost');
        },
      }),
    );

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reports malformed JSON and clears the timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('Invalid JSON');
        },
      }),
    );

    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A resposta de geocodificação é inválida.',
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('fetches current and five daily forecasts and maps the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 18.4,
          weather_code: 3,
          relative_humidity_2m: 64,
          wind_speed_10m: 12.5,
          precipitation: 0.1,
          surface_pressure: 1013.2,
        },
        daily: {
          time: [
            '2026-10-27',
            '2026-10-28',
            '2026-10-29',
            '2026-10-30',
            '2026-10-31',
            '2026-11-01',
          ],
          temperature_2m_max: [20.1, 19.8, 18.9, 20.4, 21.0, 22.0],
          temperature_2m_min: [14.2, 13.9, 13.1, 14.0, 14.7, 15.0],
          weather_code: [3, 2, 61, 3, 1, 0],
          precipitation_probability_max: [10, 20, 80, 15, 5, 0],
        },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getWeather(city)).resolves.toEqual({
      city,
      current: {
        temperatureC: 18.4,
        weatherCode: 3,
        humidityPercent: 64,
        windSpeedKmh: 12.5,
        precipitationMm: 0.1,
        pressureHpa: 1013.2,
      },
      forecast: [
        {
          date: '2026-10-27',
          temperatureMaxC: 20.1,
          temperatureMinC: 14.2,
          weatherCode: 3,
          precipitationProbabilityPercent: 10,
        },
        {
          date: '2026-10-28',
          temperatureMaxC: 19.8,
          temperatureMinC: 13.9,
          weatherCode: 2,
          precipitationProbabilityPercent: 20,
        },
        {
          date: '2026-10-29',
          temperatureMaxC: 18.9,
          temperatureMinC: 13.1,
          weatherCode: 61,
          precipitationProbabilityPercent: 80,
        },
        {
          date: '2026-10-30',
          temperatureMaxC: 20.4,
          temperatureMinC: 14,
          weatherCode: 3,
          precipitationProbabilityPercent: 15,
        },
        {
          date: '2026-10-31',
          temperatureMaxC: 21,
          temperatureMinC: 14.7,
          weatherCode: 1,
          precipitationProbabilityPercent: 5,
        },
      ],
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(requestUrl.searchParams.get('latitude')).toBe('-23.55');
    expect(requestUrl.searchParams.get('longitude')).toBe('-46.63');
    expect(requestUrl.searchParams.get('forecast_days')).toBe('5');
    expect(requestUrl.searchParams.get('timezone')).toBe('auto');
    expect(requestUrl.searchParams.get('temperature_unit')).toBe('celsius');
    expect(requestUrl.searchParams.get('current')).toContain('temperature_2m');
    expect(requestUrl.searchParams.get('daily')).toContain('precipitation_probability_max');
  });

  it.each([
    ['current', { daily: { time: [] } }],
    ['daily', { current: { temperature_2m: 18 } }],
    ['current and daily', {}],
    ['null current', { current: null, daily: { time: [] } }],
    ['null daily', { current: {}, daily: null }],
  ])('throws WeatherServiceError when %s is missing', async (_missing, payload) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      }),
    );

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('keeps null precipitation and other null metrics unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: null,
            weather_code: null,
            relative_humidity_2m: null,
            wind_speed_10m: null,
            precipitation: null,
            surface_pressure: null,
          },
          daily: {
            time: ['2026-10-27'],
            precipitation_probability_max: [null],
          },
        }),
      }),
    );

    const data = await getWeather(city);

    expect(data.current).toEqual({
      temperatureC: undefined,
      weatherCode: undefined,
      humidityPercent: undefined,
      windSpeedKmh: undefined,
      precipitationMm: undefined,
      pressureHpa: undefined,
    });
    expect(data.forecast[0].precipitationProbabilityPercent).toBeUndefined();
  });

  it('throws WeatherServiceError when the forecast response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      status: 500,
    });
  });

  it('preserves missing optional values in current and daily forecast', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {},
          daily: { time: ['2026-10-27'] },
        }),
      }),
    );

    await expect(getWeather(city)).resolves.toEqual({
      city,
      current: {
        temperatureC: undefined,
        weatherCode: undefined,
        humidityPercent: undefined,
        windSpeedKmh: undefined,
        precipitationMm: undefined,
        pressureHpa: undefined,
      },
      forecast: [
        {
          date: '2026-10-27',
          temperatureMaxC: undefined,
          temperatureMinC: undefined,
          weatherCode: undefined,
          precipitationProbabilityPercent: undefined,
        },
      ],
    });
  });
});
