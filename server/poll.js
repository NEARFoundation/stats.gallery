/**
 * Polls a function with exponential backoff.
 * Function should return a promise.
 * 
 * @param {() => Promise<any>} fn
 * @param {{ defaultValue?: any; updateInterval: number; maxRetrys?: number; }} options
 */
function poll(fn, options) {
  let result = Promise.resolve(options.defaultValue ?? undefined);
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
      const value = await fn();
      result = Promise.resolve(value);
      // Schedule next
      id = setTimeout(() => update(0), options.updateInterval);
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
