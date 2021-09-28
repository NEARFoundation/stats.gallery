// https://next.vuex.vuejs.org/guide/typescript-support.html
import { Network } from '@/services/near/indexer/networks';
import { Timeframe } from '@/services/timeframe';
import { InjectionKey } from 'vue';
import { createStore as baseCreateStore, useStore as baseUseStore } from 'vuex';
import { StoreOptions } from './store';
import { CustomStore, CustomStoreOptions } from './types';

// define injection key
export const storeInjectionKey: InjectionKey<CustomStore<StoreOptions>> =
  Symbol();

export function createStore(): CustomStore<StoreOptions> {
  return baseCreateStore<StoreOptions['state']>({
    state: {
      accountId: '',
      timeframe: Timeframe.WEEK,
      network: Network.MAINNET,
    },
    getters: {
      accountId(state) {
        return state.accountId;
      },
      network(state) {
        return state.network;
      },
      timeframe(state) {
        return state.timeframe;
      },
    },
    mutations: {
      SET_ACCOUNT_ID(state, { accountId }) {
        state.accountId = accountId;
      },
      SET_TIMEFRAME(state, { timeframe }) {
        state.timeframe = timeframe;
      },
      SET_NETWORK(state, { network }) {
        state.network = network;
      },
    },
    actions: {
      SET_ACCOUNT_ID({ commit }, payload) {
        commit('SET_ACCOUNT_ID', payload);
      },
      SET_TIMEFRAME({ commit }, payload) {
        commit('SET_TIMEFRAME', payload);
      },
      SET_NETWORK({ commit }, payload) {
        commit('SET_NETWORK', payload);
      },
    },
    strict: process.env['NODE_ENV'] !== 'production',
  } as CustomStoreOptions<StoreOptions>);
}

export function useStore(): CustomStore<StoreOptions> {
  return baseUseStore(storeInjectionKey);
}
