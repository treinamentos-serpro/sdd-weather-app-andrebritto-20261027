import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('converts %i°C to %i°F', (celsius, fahrenheit) => {
    expect(convertTemperature(celsius, 'fahrenheit')).toBe(fahrenheit);
  });

  it('returns the original Celsius value when Celsius is selected', () => {
    expect(convertTemperature(21.5, 'celsius')).toBe(21.5);
  });
});

describe('formatTemperature', () => {
  it.each([
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_VALUE,
  ])('does not display non-finite temperatures or conversion overflow: %s', (value) => {
    expect(formatTemperature(value, 'fahrenheit')).toBe('Indisponível');
  });
  it('rounds to one decimal and appends the Celsius symbol', () => {
    expect(formatTemperature(21.26, 'celsius')).toBe('21,3 °C');
  });

  it('rounds the converted value and appends the Fahrenheit symbol', () => {
    expect(formatTemperature(22.4, 'fahrenheit')).toBe('72,3 °F');
  });

  it('keeps missing values unavailable', () => {
    expect(formatTemperature(undefined, 'celsius')).toBe('Indisponível');
  });
});

describe('unitLabel', () => {
  it('returns the selected unit symbol', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
