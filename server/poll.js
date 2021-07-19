function poll(fn, updateInterval) {
  let result = fn();
  const call = () => result;
  const id = setInterval(() => {
    result = fn();
  }, updateInterval);
  const cancel = () => clearInterval(id);

  return [call, cancel];
}

module.exports = poll;
