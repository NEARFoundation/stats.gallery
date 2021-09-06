import createApp from './app';

export default function () {
  const { app, router } = createApp();

  console.log('entry-server.ts', process.env);

  return {
    app,
    router,
  };
}
