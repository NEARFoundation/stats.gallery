import axios from 'axios';
import { DateTime } from 'luxon';
import { Network, networks } from './networks';
import { IAccessKey } from './types';

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

  public async getGasSpent({
    account,
    sinceBlockTimestamp = DateTime.now().minus({ days: 1 }).toMillis() *
      1_000_000,
    inTokens = false,
  }: {
    account: string;
    sinceBlockTimestamp: number;
    inTokens?: boolean;
  }): Promise<number> {
    return axios({
      baseURL: this.endpoint,
      url: inTokens ? 'gas-tokens-spent' : 'gas-spent',
      params: {
        account_id: account,
        since_block_timestamp: sinceBlockTimestamp,
      },
    }).then(r => {
      if (inTokens) {
        return r.data[0].gas_tokens_spent;
      } else {
        return r.data[0].gas_spent;
      }
    });
  }

  public async getTransactionCount({
    account,
    sinceBlockTimestamp = DateTime.now().minus({ days: 1 }).toMillis() *
      1_000_000,
  }: {
    account: string;
    sinceBlockTimestamp?: number;
  }): Promise<number> {
    return axios({
      baseURL: this.endpoint,
      url: 'transaction-count',
      params: {
        account_id: account,
        since_block_timestamp: sinceBlockTimestamp,
      },
    }).then(r => r.data[0].transaction_count);
  }
}
