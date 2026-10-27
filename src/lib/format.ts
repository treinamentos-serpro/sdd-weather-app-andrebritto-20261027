const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
  weekday: 'short',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
});

function parseIsoDate(isoDate: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return undefined;
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return undefined;
  }

  return date;
}

export function formatDayLabel(isoDate: string, index?: number): string {
  const date = parseIsoDate(isoDate);
  if (!date) {
    return 'Data indisponível';
  }
  if (index === 0) {
    return 'Hoje';
  }
  if (index === 1) {
    return 'Amanhã';
  }

  const label = dayFormatter.format(date).replace('.', '');
  return label.charAt(0).toLocaleUpperCase('pt-BR') + label.slice(1);
}

export function getShortDate(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  return date ? shortDateFormatter.format(date) : 'Data indisponível';
}
