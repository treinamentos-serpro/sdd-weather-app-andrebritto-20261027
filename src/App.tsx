import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import useWeather from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const weather = useWeather();

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
        <SearchBar onSearch={weather.search} />
      </header>

      <main className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-8">
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {weather.status === 'success' && weather.data
            ? `Previsão carregada para ${weather.data.city.name}.`
            : weather.status === 'selecting'
              ? `${weather.cities.length} cidades encontradas. Selecione uma cidade.`
              : ''}
        </p>
        {weather.status === 'idle' && (
          <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center shadow-glass backdrop-blur-md sm:px-12">
            <p aria-hidden="true" className="text-5xl">
              🌤️
            </p>
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              O tempo da sua cidade, em um só lugar
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Busque uma cidade para consultar o clima atual e a previsão para os próximos dias.
            </p>
          </section>
        )}

        {weather.status === 'loading' && (
          <LoadingState message={`Buscando previsão para ${weather.query}...`} />
        )}

        {weather.status === 'selecting' && (
          <section aria-labelledby="city-selection-title">
            <h2 id="city-selection-title" className="mb-4 text-xl font-semibold">
              Selecione uma cidade
            </h2>
            <ul className="flex flex-col gap-3">
              {weather.cities.map((city) => (
                <li key={`${city.name}-${city.latitude}-${city.longitude}`}>
                  <button
                    type="button"
                    onClick={() => weather.selectCity(city)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400"
                  >
                    {[city.name, city.admin1, city.country].filter(Boolean).join(', ')}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {weather.status === 'empty' && (
          <EmptyState
            title={`Nenhuma cidade encontrada para "${weather.query}"`}
            hint="Confira o nome e tente fazer outra busca."
          />
        )}

        {weather.status === 'error' && (
          <ErrorState
            message={weather.error ?? 'Não foi possível consultar o clima.'}
            onRetry={weather.retry}
          />
        )}

        {weather.status === 'success' && weather.data && (
          <>
            <CurrentWeather city={weather.data.city} current={weather.data.current} unit={unit} />
            <ForecastList forecast={weather.data.forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
}
