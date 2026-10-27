import { act, renderHook } from '@testing-library/react';
import useWeather from '../../../src/hooks/useWeather';
import { getWeather, searchCities } from '../../../src/services/weatherService';
import type { City, WeatherData } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const city: City = {
  name: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
};

const anotherCity: City = {
  name: 'Lisboa',
  latitude: 38.72,
  longitude: -9.13,
};

const weatherData: WeatherData = {
  city,
  current: { temperatureC: 20 },
  forecast: [],
};

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts idle with empty data and no error', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current).toMatchObject({
      status: 'idle',
      data: null,
      cities: [],
      error: null,
      query: '',
    });
  });

  it('searches and loads the weather for the first city', async () => {
    vi.mocked(searchCities).mockResolvedValue([city, anotherCity]);
    vi.mocked(getWeather).mockResolvedValue(weatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search(' São Paulo ');
    });

    expect(searchCities).toHaveBeenCalledExactlyOnceWith('São Paulo');
    expect(getWeather).toHaveBeenCalledExactlyOnceWith(city);
    expect(result.current).toMatchObject({
      status: 'success',
      data: weatherData,
      cities: [city, anotherCity],
      error: null,
      query: 'São Paulo',
    });
  });

  it('sets empty when search returns no cities', async () => {
    vi.mocked(searchCities).mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Cidade inexistente');
    });

    expect(getWeather).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({
      status: 'empty',
      data: null,
      cities: [],
      error: null,
      query: 'Cidade inexistente',
    });
  });

  it('loads the explicitly selected city and retains search results', async () => {
    vi.mocked(getWeather).mockResolvedValue({ ...weatherData, city: anotherCity });
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(anotherCity);
    });

    expect(getWeather).toHaveBeenCalledExactlyOnceWith(anotherCity);
    expect(result.current).toMatchObject({
      status: 'success',
      data: { city: anotherCity },
    });
  });

  it('sets error when searching fails', async () => {
    vi.mocked(searchCities).mockRejectedValue(new Error('Falha de rede.'));
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(result.current).toMatchObject({
      status: 'error',
      data: null,
      error: 'Falha de rede.',
      query: 'São Paulo',
    });
  });

  it('retries the last search operation', async () => {
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce([city]);
    vi.mocked(getWeather).mockResolvedValue(weatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });
    await act(async () => {
      await result.current.retry();
    });

    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(searchCities).toHaveBeenLastCalledWith('São Paulo');
    expect(result.current.status).toBe('success');
  });

  it('retries the last selected city operation', async () => {
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce({ ...weatherData, city: anotherCity });
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(anotherCity);
    });
    await act(async () => {
      await result.current.retry();
    });

    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenLastCalledWith(anotherCity);
    expect(result.current.status).toBe('success');
  });

  it('retries only forecast when it fails after a successful city search', async () => {
    vi.mocked(searchCities).mockResolvedValue([city]);
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce(weatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });
    expect(result.current).toMatchObject({
      status: 'error',
      data: null,
      cities: [city],
      error: 'Falha de rede.',
    });

    await act(async () => {
      await result.current.retry();
    });
    expect(searchCities).toHaveBeenCalledOnce();
    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenLastCalledWith(city);
    expect(result.current).toMatchObject({
      status: 'success',
      data: weatherData,
      error: null,
    });
  });

  it('ignores a stale search response when a newer search has finished', async () => {
    let resolveFirstSearch: (cities: City[]) => void = () => {};
    vi.mocked(searchCities)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirstSearch = resolve;
          }),
      )
      .mockResolvedValueOnce([anotherCity]);
    vi.mocked(getWeather).mockResolvedValue({ ...weatherData, city: anotherCity });
    const { result } = renderHook(() => useWeather());

    let firstSearch: Promise<void> = Promise.resolve();
    await act(async () => {
      firstSearch = result.current.search('São Paulo');
    });
    await act(async () => {
      await result.current.search('Lisboa');
    });
    await act(async () => {
      resolveFirstSearch([city]);
      await firstSearch;
    });

    expect(result.current).toMatchObject({
      status: 'success',
      data: { city: anotherCity },
      query: 'Lisboa',
    });
  });
});
