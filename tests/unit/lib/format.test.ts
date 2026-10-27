import { formatDayLabel } from '../../../src/lib/format';

describe('formatDayLabel', () => {
  it('formats an ISO date as a localized weekday without timezone shifting', () => {
    expect(formatDayLabel('2026-10-27')).toBe('Ter');
  });

  it('returns an unavailable label for invalid dates', () => {
    expect(formatDayLabel('2026-02-30')).toBe('Data indisponível');
    expect(formatDayLabel('not-a-date')).toBe('Data indisponível');
  });
});
