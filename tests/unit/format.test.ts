import { formatDayLabel, getShortDate } from '../../src/lib/format';

describe('date formatting in pt-BR', () => {
  it('preserves the civil date when formatting day and month', () => {
    expect(getShortDate('2026-01-01')).toBe('01/01');
    expect(getShortDate('2026-12-31')).toBe('31/12');
  });

  it('uses the approved relative and weekday labels', () => {
    expect(formatDayLabel('2026-10-27', 0)).toBe('Hoje');
    expect(formatDayLabel('2026-10-28', 1)).toBe('Amanhã');
    expect(formatDayLabel('2026-10-29', 2)).toBe('Qui');
  });

  it('preserves leap days', () => {
    expect(getShortDate('2028-02-29')).toBe('29/02');
  });

  it.each([
    '2026-02-29',
    '2026-13-01',
    '2026-04-31',
    '',
    'invalid',
  ])('does not invent a date for invalid input: %s', (value) => {
    expect(getShortDate(value)).toBe('Data indisponível');
    expect(formatDayLabel(value, 0)).toBe('Data indisponível');
  });
});
