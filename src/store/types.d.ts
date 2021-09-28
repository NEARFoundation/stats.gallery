import { CommitOptions, DispatchOptions, Store, StoreOptions } from 'vuex';
import { Action, Mutation } from './store';

export interface StoreOptionsType {
  state: Record<string, any>;
  mutation: Record<string, any>;
  action: Record<string, any>;
}

export type Getter<T, S extends StoreOptionsType, R = S> = (
  state: S['state'],
  getters: Getters<S>,
  rootState: R['state'],
  rootGetters: Getters<R>,
) => T;

export type GetterOptions<S extends StoreOptionsType, R = S> = {
  [key in keyof S['state']]: Getter<S['state'][key], S, R>;
};

export type Getters<S extends StoreOptionsType> = {
  readonly [key in keyof S['state']]: S['state'][key];
};

export type MutationOptions<S extends StoreOptionsType> = {
  [key in keyof S['mutation']]: (
    state: S['state'],
    payload: S['mutation'][key],
  ) => void;
};

export interface ActionContext<S extends StoreOptionsType, R = S> {
  dispatch: Dispatch<S>;
  commit: Commit<S>;
  state: S['state'];
  getters: Getters<S>;
  rootState: R['state'];
  rootGetters: Getters<R>;
}

export type ActionOptions<S extends StoreOptionsType, R = S> = {
  [key in keyof S['action']]: (
    this: Store<R['store']>,
    injectee: ActionContext<S, R>,
    payload: S['action'][key],
  ) => Promise<void> | void;
};

export type Commit<S extends StoreOptionsType> = <
  K extends keyof S['mutation'],
>(
  type: K,
  payload: S['mutation'][K],
  options?: CommitOptions,
) => void;

export type Dispatch<S extends StoreOptionsType> = <
  K extends keyof S['action'],
>(
  type: K,
  payload: S['action'][K],
  options?: DispatchOptions,
) => Promise<void>;

export type CustomStoreOptions<S extends StoreOptionsType> = Omit<
  StoreOptions<S['state']>,
  'getters' | 'mutations' | 'actions'
> & {
  getters: GetterOptions<S>;
  mutations: MutationOptions<S>;
  actions: ActionOptions<S>;
};

export type CustomStore<S extends StoreOptionsType> = Omit<
  Store<S['state']>,
  'getters' | 'commit' | 'dispatch'
> & {
  getters: Getters<S>;
  commit: Commit<S>;
  dispatch: Dispatch<S>;
};
