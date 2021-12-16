import axios from 'axios';
import { Cache } from '../cache';
import { Network, networks } from './networks';
import {
  ActionKind,
  IAccessKey,
  ReceiptAction,
  UnifiedTransactionAction,
} from './types';

export interface RequestParams {
  account: string;
  after: number;
  before: number;
}

function upperIntersection(
  cachedRange: { after: number; before: number },
  request: RequestParams,
): false | number {
  if (request.after < cachedRange.after) {
    return false;
  } else {
    return cachedRange.before;
  }
}

export class IndexerClient {
  public static from(network: Network): IndexerClient {
    return new IndexerClient(network);
  }

  private _network: Network;

  public get network(): Network {
    return this._network;
  }
  public set network(network: Network) {
    this._network = network;
  }

  private get endpoint() {
    return networks[this.network].indexer;
  }

  public constructor(network: Network) {
    this._network = network;
  }

  public async getAccessKeys(account: string): Promise<IAccessKey[]> {
    return axios({
      baseURL: this.endpoint,
      url: 'access-keys',
      params: {
        account_id: account,
      },
    }).then(r => r.data);
  }

  public async getSingle<T>(
    url: string,
    { account, before, after }: RequestParams,
  ): Promise<T> {
    return axios({
      baseURL: this.endpoint,
      url,
      params: {
        account_id: account,
        after_block_timestamp: after,
        before_block_timestamp: before,
      },
    }).then(r => r.data[0].result);
  }

  public async getGasTokensSpent(params: RequestParams): Promise<string> {
    return this.getSingle('gas-tokens-spent', params);
  }

  public async getGasSpent(params: RequestParams): Promise<string> {
    return this.getSingle('gas-spent', params);
  }

  public async getSentTransactionCount(params: RequestParams): Promise<number> {
    return this.getSingle('sent-transaction-count', params);
  }

  public async getScore(params: RequestParams): Promise<number> {
    return this.getSingle('score', params);
  }

  public async getMethodUsage({
    account,
    methodName,
  }: {
    account: string;
    methodName: string;
  }): Promise<Pick<ReceiptAction<ActionKind.FUNCTION_CALL>, 'args'>[]> {
    return axios({
      baseURL: this.endpoint,
      url: 'method-usage',
      params: {
        account_id: account,
        method_name: methodName,
      },
    }).then(r => r.data);
  }

  public async getDistribution(): Promise<
    Record<string, number> & { total: number }
  > {
    return axios({
      baseURL: this.endpoint,
      url: 'account-activity-distribution',
    }).then(r => r.data[0]);
  }

  public async getMultiple<T>(
    url: string,
    { account, before, after }: RequestParams,
  ): Promise<T[]> {
    return axios({
      baseURL: this.endpoint,
      url,
      params: {
        account_id: account,
        after_block_timestamp: after,
        before_block_timestamp: before,
      },
    }).then(r => r.data);
  }

  public async getRecentTransactionActions(
    params: RequestParams,
  ): Promise<UnifiedTransactionAction[]> {
    return this.getMultiple('recent-transaction-actions', params);
  }

  public async getActions(params: RequestParams): Promise<ReceiptAction[]> {
    const cache = Cache.from(this.network);
    const cachedRange = await cache.getActionRange(params.account);
    if (cachedRange !== undefined) {
      const lowerBound = upperIntersection(cachedRange, params);
      if (lowerBound !== false) {
        const freshParams = { ...params, after: lowerBound };
        const freshActionsPromise = this.getMultiple<ReceiptAction>(
          'actions',
          freshParams,
        );
        const cachedActionsPromise = cache.getActions(params);
        const [freshActions, cachedActions] = await Promise.all([
          freshActionsPromise,
          cachedActionsPromise,
        ]);
        const actions = freshActions.concat(cachedActions);
        cache.putActions({ params, actions });
        return actions;
      }
    }

    const actions = await this.getMultiple<ReceiptAction>('actions', params);
    cache.putActions({ params, actions });
    return actions;
  }
}
