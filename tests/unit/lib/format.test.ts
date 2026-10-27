import { formatDayLabel, getShortDate } from '../../../src/lib/format';

describe('formatDayLabel', () => {
  it('formats an ISO date as a localized weekday without timezone shifting', () => {
    expect(formatDayLabel('2026-10-27')).toBe('Ter');
  });

  it('labels index zero as today and index one as tomorrow', () => {
    expect(formatDayLabel('2026-10-27', 0)).toBe('Hoje');
    expect(formatDayLabel('2026-10-28', 1)).toBe('Amanhã');
  });

  it.each([
    ['2026-10-29', 2, 'Qui'],
    ['2026-10-30', 3, 'Sex'],
    ['2026-10-31', 4, 'Sáb'],
  ])('labels %s at index %i with weekday %s', (date, index, label) => {
    expect(formatDayLabel(date, index)).toBe(label);
  });

  it('returns an unavailable label for invalid dates', () => {
    expect(formatDayLabel('2026-02-30')).toBe('Data indisponível');
    expect(formatDayLabel('not-a-date')).toBe('Data indisponível');
    expect(formatDayLabel('not-a-date', 0)).toBe('Data indisponível');
    expect(formatDayLabel('2026-02-30', 1)).toBe('Data indisponível');
  });
});

describe('getShortDate', () => {
  it.each([
    ['2026-10-27', '27/10'],
    ['2026-01-05', '05/01'],
    ['2024-02-29', '29/02'],
  ])('formats %s as %s without using the device timezone', (date, expected) => {
    expect(getShortDate(date)).toBe(expected);
  });

  it.each([
    '2026-02-30',
    '2026-02-29',
    '2026-13-01',
    '',
    'not-a-date',
  ])('returns an unavailable label for invalid date %s', (date) => {
    expect(getShortDate(date)).toBe('Data indisponível');
  });
});
