// De-duplicate requests within one second
const REQUEST_EXPIRATION_TIMEOUT = 1000;
const requests = new Map<string, Promise<any>>();

export function requestId(...parts: string[]): string {
  return parts.map(s => btoa(s)).join('-');
}

export function debounceRequest<T>(
  rid: string,
  makeRequest: () => Promise<T>,
  timeout = REQUEST_EXPIRATION_TIMEOUT,
): Promise<T> {
  // Check if we have already made the request (in the past `requestExpirationTimeout` ms)
  const savedRequest = requests.get(rid);

  if (savedRequest) {
    return savedRequest as Promise<T>;
  } else {
    // Actually make the request
    const request = makeRequest();

    // Save for the next `requestExpirationTimeout` ms
    requests.set(rid, request);
    setTimeout(() => {
      const get = requests.get(rid);
      // Only clear the same request
      if (get === request) {
        requests.delete(rid);
      }
    }, timeout);

    return request;
  }
}
