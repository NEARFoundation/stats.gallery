import { decode } from '@webassemblyjs/wasm-parser';

export function parseWasm(wasmb64: string): any {
  return decode(
    // fixed byte array
    new Uint8Array(
      // decode base64, convert to js array of bytes
      atob(wasmb64.toString().trim())
        .split('')
        .map(c => c.charCodeAt(0)),
    ),
    {},
  );
}
