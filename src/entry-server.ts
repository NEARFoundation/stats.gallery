import createApp from './app';

export default function () {
  const { app, router } = createApp();

  return {
    app,
    router,
  };
}
