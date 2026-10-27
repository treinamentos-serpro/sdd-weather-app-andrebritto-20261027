import { useCallback, useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

interface WeatherState {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
}

type WeatherOperation = { type: 'search'; name: string } | { type: 'selectCity'; city: City };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado ao consultar o clima.';
}

const initialState: WeatherState = {
  status: 'idle',
  data: null,
  cities: [],
  error: null,
  query: '',
};

export default function useWeather() {
  const [state, setState] = useState<WeatherState>(initialState);
  const requestId = useRef(0);
  const lastOperation = useRef<WeatherOperation | null>(null);

  const selectCity = useCallback(async (city: City) => {
    const currentRequestId = ++requestId.current;
    lastOperation.current = { type: 'selectCity', city };
    setState((current) => ({
      ...current,
      status: 'loading',
      data: null,
      error: null,
    }));

    try {
      const data = await getWeather(city);
      if (currentRequestId !== requestId.current) {
        return;
      }

      setState((current) => ({
        ...current,
        status: 'success',
        data,
        error: null,
      }));
    } catch (error) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setState((current) => ({
        ...current,
        status: 'error',
        data: null,
        error: getErrorMessage(error),
      }));
    }
  }, []);

  const search = useCallback(async (name: string) => {
    const query = name.trim();
    const currentRequestId = ++requestId.current;
    lastOperation.current = { type: 'search', name };
    setState({
      status: 'loading',
      data: null,
      cities: [],
      error: null,
      query,
    });

    try {
      const cities = await searchCities(query);
      if (currentRequestId !== requestId.current) {
        return;
      }

      if (cities.length === 0) {
        setState({
          status: 'empty',
          data: null,
          cities: [],
          error: null,
          query,
        });
        return;
      }

      setState((current) => ({
        ...current,
        cities,
        status: 'loading',
        error: null,
      }));
      lastOperation.current = { type: 'selectCity', city: cities[0] };

      const data = await getWeather(cities[0]);
      if (currentRequestId !== requestId.current) {
        return;
      }

      setState((current) => ({
        ...current,
        status: 'success',
        data,
        error: null,
      }));
    } catch (error) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setState((current) => ({
        ...current,
        status: 'error',
        data: null,
        error: getErrorMessage(error),
      }));
    }
  }, []);

  const retry = useCallback(async () => {
    const operation = lastOperation.current;
    if (!operation) {
      return;
    }

    if (operation.type === 'search') {
      await search(operation.name);
    } else {
      await selectCity(operation.city);
    }
  }, [search, selectCity]);

  return {
    status: state.status,
    data: state.data,
    cities: state.cities,
    error: state.error,
    query: state.query,
    search,
    selectCity,
    retry,
  };
}
