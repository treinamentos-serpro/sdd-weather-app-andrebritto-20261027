import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity || disabled) {
      return;
    }

    onSearch(trimmedCity);
  }

  return (
    <form
      role="search"
      aria-label="Busca de cidades"
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:flex-row"
    >
      <div className="flex-1">
        <label htmlFor="city-search" className="mb-2 block text-sm font-medium text-white">
          Buscar cidade
        </label>
        <input
          id="city-search"
          name="city"
          type="search"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          disabled={disabled}
          placeholder="Ex.: São Paulo"
          className="w-full rounded-xl border border-white/10 bg-night-800/80 px-4 py-3 text-white placeholder:text-white/50 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="min-h-11 self-end rounded-xl bg-accent-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60 sm:mb-0"
      >
        Buscar
      </button>
    </form>
  );
}
