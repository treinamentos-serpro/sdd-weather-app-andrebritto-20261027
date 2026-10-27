import { getWeatherCondition } from '../../../src/lib/weatherCodes';

describe('getWeatherCondition', () => {
  it('returns a localized label and icon for known WMO codes', () => {
    expect(getWeatherCondition(2)).toEqual({
      description: 'Parcialmente nublado',
      icon: '⛅',
    });
  });

  it('does not invent a condition for missing or unknown codes', () => {
    expect(getWeatherCondition(undefined)).toBeUndefined();
    expect(getWeatherCondition(999)).toBeUndefined();
  });
});
