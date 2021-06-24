import axios from 'axios';
import { Network, networks } from './networks';
import {
  IAccessKey,
  ITransaction,
  ITransactionAction,
  TransactionActionArgs,
} from './types';

interface RequestParams {
  account: string;
  after?: number;
  before?: number;
}

export class NearClient {
  private _network: Network;

  public get network(): Network {
    return this._network;
  }
  public set network(network: Network) {
    this._network = network;
  }

  private get endpoint() {
    return networks[this.network].endpoint;
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

  public async getTransactionCount(params: RequestParams): Promise<number> {
    return this.getSingle('transaction-count', params);
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

  public async getRecentTransactionActions<
    T extends Pick<
      ITransaction,
      'block_timestamp' | 'signer_account_id' | 'receiver_account_id'
    > &
      ITransactionAction<TransactionActionArgs>,
  >(params: RequestParams): Promise<T[]> {
    return this.getMultiple('recent-transaction-actions', params);
  }
}
