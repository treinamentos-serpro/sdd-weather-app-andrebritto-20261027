import { getWeatherCondition } from '../../../src/lib/weatherCodes';

describe('getWeatherCondition', () => {
  it.each([
    [0, 'Céu limpo', '☀️'],
    [2, 'Parcialmente nublado', '⛅'],
    [61, 'Chuva fraca', '🌧️'],
    [95, 'Tempestade', '⛈️'],
  ])('returns the localized condition for WMO code %i', (code, description, icon) => {
    expect(getWeatherCondition(code)).toEqual({
      description,
      icon,
    });
  });

  it.each([
    undefined,
    999,
    -1,
  ])('returns the unavailable fallback for missing or unknown code %s', (code) => {
    expect(getWeatherCondition(code)).toBeUndefined();
  });
});
