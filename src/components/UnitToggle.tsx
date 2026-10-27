import { type KeyboardEvent, useRef } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const celsiusButtonRef = useRef<HTMLButtonElement>(null);
  const fahrenheitButtonRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const isCelsiusButton = event.currentTarget === celsiusButtonRef.current;
    let nextUnit: Unit | undefined;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'End') {
      nextUnit = event.key === 'End' ? 'fahrenheit' : isCelsiusButton ? 'fahrenheit' : 'celsius';
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'Home') {
      nextUnit = event.key === 'Home' ? 'celsius' : isCelsiusButton ? 'fahrenheit' : 'celsius';
    }

    if (!nextUnit) {
      return;
    }

    event.preventDefault();
    onChange(nextUnit);
    if (nextUnit === 'celsius') {
      celsiusButtonRef.current?.focus();
    } else {
      fahrenheitButtonRef.current?.focus();
    }
  }

  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
    >
      <button
        ref={celsiusButtonRef}
        type="button"
        aria-label="Celsius"
        aria-pressed={unit === 'celsius'}
        onClick={() => onChange('celsius')}
        onKeyDown={handleKeyDown}
        className={`min-h-11 min-w-11 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${
          unit === 'celsius'
            ? 'bg-accent-700 text-white hover:bg-accent-600'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        °C
      </button>
      <button
        ref={fahrenheitButtonRef}
        type="button"
        aria-label="Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
        onKeyDown={handleKeyDown}
        className={`min-h-11 min-w-11 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${
          unit === 'fahrenheit'
            ? 'bg-accent-700 text-white hover:bg-accent-600'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        °F
      </button>
    </div>
  );
}
