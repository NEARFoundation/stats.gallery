export function getTrivialHash(value: string): number {
  return (value + '')
    .split('')
    .map(c => c.charCodeAt(0))
    .reduce((acc, x) => (acc << 5) - acc + x, 0);
}

// Source: https://stackoverflow.com/a/52171480
export function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function getDeterministicColor(value: string): string {
  const hash = cyrb53(value);
  const color = '#' + (hash & 0xffffff).toString(16).padStart(6, '0');
  return color;
}

export function getDeterministicHueColor(
  value: string,
  saturation: number,
  lightness: number,
): string {
  const hash = cyrb53(value);
  const color = `hsl(${hash % 256}, ${saturation}%, ${lightness}%)`;
  return color;
}
