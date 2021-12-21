import { watch } from 'vue';
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router';

export type TitleGenerator = (route: RouteLocationNormalizedLoaded) => string;

export function useTitle(generator: TitleGenerator): void {
  const router = useRouter();

  watch(router.currentRoute, route => {
    window.document.title = generator(route);
  });
}
