export function isString(x: any): x is string {
  return x + '' === x;
}

export function isNumber(x: any): x is number {
  return +x === x;
}

export function isBoolean(x: any): x is boolean {
  return !!x === x;
}
