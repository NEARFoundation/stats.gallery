const compactFormatter = Intl.NumberFormat('en', { notation: 'compact' });
const standardFormatter = Intl.NumberFormat('en', { notation: 'standard' });

export function compactNumber(value: number): string {
  return compactFormatter.format(value);
}

export function standardNumber(value: number): string {
  return standardFormatter.format(value);
}
