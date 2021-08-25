const compactFormatter = Intl.NumberFormat('en', { notation: 'compact' });
const standardFormatter = Intl.NumberFormat('en', { notation: 'standard' });
const percentFormatter = Intl.NumberFormat('en', {
  style: 'percent',
  maximumFractionDigits: 2,
});

export function compactNumber(value: number): string {
  return compactFormatter.format(value);
}

export function standardNumber(value: number): string {
  return standardFormatter.format(value);
}

export function percentNumber(value: number): string {
  return percentFormatter.format(value);
}
