export type GuessableTypeString =
  | 'null'
  | 'string'
  | 'number'
  | 'boolean'
  | 'json';

// Concrete type hacking :D
const y: unknown = void 0;
const x = typeof y;
export const typeofMap: { [key in typeof x]?: GuessableTypeString } = {
  object: 'json',
  boolean: 'boolean',
  number: 'number',
  string: 'string',
  undefined: 'null',
};

export type Guess =
  | { type: 'null'; value: null }
  | { type: 'boolean'; value: boolean }
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'json'; value: unknown };

export function getType(x: unknown): GuessableTypeString {
  return typeofMap[typeof x] ?? 'string';
}

export function guessType(s: string): Guess {
  const lower = (s + '').toLowerCase();
  switch (lower) {
    case 'null':
    case 'undefined':
      return { type: 'null', value: null };
    case 'true':
      return { type: 'boolean', value: true };
    case 'false':
      return { type: 'boolean', value: false };
  }

  if (s.trim().length && !isNaN(+s)) {
    return { type: 'number', value: +s };
  }

  try {
    const value = JSON.parse(s);
    return { type: 'json', value };
  } catch (_) {
    return { type: 'string', value: s };
  }
}
