import { isRef, Ref } from 'vue';

export type OptionalRef<T> = Ref<T> | T;
export type Deref<T> = T extends Ref<infer U> ? U : T;

export function deref<T>(x: OptionalRef<T>): T {
  if (isRef(x)) {
    return x.value;
  } else {
    return x;
  }
}
