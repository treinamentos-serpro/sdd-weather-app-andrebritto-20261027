import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockWeatherData } from './mocks/weather';
import type { Unit, WeatherData } from './types/weather';

type WeatherViewState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'empty'; query: string }
  | { status: 'error'; query: string; message: string }
  | { status: 'success'; data: WeatherData };

const MOCK_LOADING_DELAY_MS = 350;

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [viewState, setViewState] = useState<WeatherViewState>({ status: 'idle' });
  const searchTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (searchTimer.current !== undefined) {
        window.clearTimeout(searchTimer.current);
      }
    },
    [],
  );

  function searchMockWeather(query: string) {
    if (searchTimer.current !== undefined) {
      window.clearTimeout(searchTimer.current);
    }

    setViewState({ status: 'loading', query });
    searchTimer.current = window.setTimeout(() => {
      try {
        const normalizedQuery = query.toLocaleLowerCase('pt-BR');
        const normalizedCity = mockWeatherData.city.name.toLocaleLowerCase('pt-BR');

        if (normalizedQuery === normalizedCity) {
          setViewState({ status: 'success', data: mockWeatherData });
        } else {
          setViewState({ status: 'empty', query });
        }
      } catch {
        setViewState({
          status: 'error',
          query,
          message: 'Não foi possível carregar os dados de demonstração.',
        });
      } finally {
        searchTimer.current = undefined;
      }
    }, MOCK_LOADING_DELAY_MS);
  }

  function retrySearch() {
    if (viewState.status === 'error') {
      searchMockWeather(viewState.query);
    }
  }

  return (
    <div className="min-h-screen bg-night-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-600/20 via-night-900 to-night-900 px-4 py-6 text-white sm:px-6 sm:py-10">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 self-start">
            <span aria-hidden="true" className="text-3xl">
              ☀️
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">Clima Agora</span>
              <span className="block text-sm text-white/60">
                Previsão simples, onde você estiver
              </span>
            </span>
          </div>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <SearchBar onSearch={searchMockWeather} />
      </header>

      <main className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-8">
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {viewState.status === 'success'
            ? `Previsão carregada para ${viewState.data.city.name}.`
            : ''}
        </p>
        {viewState.status === 'idle' && (
          <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center shadow-glass backdrop-blur-md sm:px-12">
            <p aria-hidden="true" className="text-5xl">
              🌤️
            </p>
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              O tempo da sua cidade, em um só lugar
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Busque por São Paulo para visualizar a previsão de demonstração. Os dados são locais e
              não usam a API.
            </p>
          </section>
        )}

        {viewState.status === 'loading' && (
          <LoadingState message={`Buscando previsão para ${viewState.query}...`} />
        )}

        {viewState.status === 'empty' && (
          <EmptyState
            title={`Nenhum dado encontrado para "${viewState.query}"`}
            hint="Neste modo de demonstração, tente buscar por São Paulo."
          />
        )}

        {viewState.status === 'error' && (
          <ErrorState message={viewState.message} onRetry={retrySearch} />
        )}

        {viewState.status === 'success' && (
          <>
            <CurrentWeather
              city={viewState.data.city}
              current={viewState.data.current}
              unit={unit}
            />
            <ForecastList forecast={viewState.data.forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
}
