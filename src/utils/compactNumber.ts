const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export function compactNumber(value: number): string {
  return formatter.format(value);
}
