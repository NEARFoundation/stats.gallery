/**
 * Polls a function with exponential backoff.
 * Function should return a promise.
 * 
 * @param {() => Promise<any>} fn
 * @param {{ defaultValue?: any; updateInterval: number; maxRetrys?: number; }} options
 */
function poll(fn, options) {
  let firstRun = true;
  let result = Promise.resolve(options.defaultValue);
  let id = -1;
  const call = () => result;
  let canceled = false;
  const cancel = () => {
    canceled = true;
    clearTimeout(id);
  };

  const update = async depth => {
    if (canceled) return;

    try {
      if (firstRun) {
        // Await the result if we have nothing but the default value
        // Hopefully it doesn't error, otherwise return the default value
        const inFlight = fn();
        result = inFlight.catch(() => options.defaultValue);

        await inFlight;
      } else {
        const value = await fn();
        // Only overwrite result with good data
        result = Promise.resolve(value);
      }
      // Schedule next
      id = setTimeout(() => update(0), options.updateInterval);
      firstRun = false;
    } catch (e) {
      if (depth < (options.maxRetrys ?? 7)) {
        // Retry without changing `result`
        id = setTimeout(
          () => update(depth + 1),
          10 * 2 ** depth + Math.floor(Math.random() * 40),
        );
      } else {
        // Reject and schedule next
        result = Promise.reject();
        id = setTimeout(() => update(0), options.updateInterval);
      }
    }
  };

  update(0);

  return { call, cancel };
}

module.exports = poll;
