import { formatTemperature } from '../../../src/lib/temperature';

describe('formatTemperature', () => {
  it('formats Celsius values', () => {
    expect(formatTemperature(22.4, 'celsius')).toBe('22,4 °C');
  });

  it('converts Celsius to Fahrenheit for display', () => {
    expect(formatTemperature(22.4, 'fahrenheit')).toBe('72,3 °F');
  });

  it('preserves missing values as unavailable', () => {
    expect(formatTemperature(undefined, 'celsius')).toBe('Indisponível');
  });
});
