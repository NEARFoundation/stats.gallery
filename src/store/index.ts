// https://next.vuex.vuejs.org/guide/typescript-support.html
import { InjectionKey } from 'vue';
import {
  createStore as baseCreateStore,
  Store,
  useStore as baseUseStore,
} from 'vuex';
import { State } from './State';
export { State } from './State';

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export function createStore(): Store<State> {
  return baseCreateStore<State>({
    state: {
      currentAccountId: '',
    },
    getters: {
      accountId(state) {
        return state.currentAccountId + '.near?';
      },
    },
    mutations: {
      updateAccountId(state, payload: { accountId: string }) {
        state.currentAccountId = payload.accountId;
      },
    },
    actions: {
      updateAccountId({ commit }, payload: { accountId: string }) {
        commit('updateAccountId', payload);
      },
    },
    strict: process.env['NODE_ENV'] !== 'production',
  });
}

export function useStore(): Store<State> {
  return baseUseStore(key);
}
