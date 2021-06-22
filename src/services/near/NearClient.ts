import axios from 'axios';
import { Network, networks } from './networks';
import { IAccessKey } from './types';

interface SingleParams {
  account: string;
  since: number;
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

  public async getSingle(
    url: string,
    { account, since }: SingleParams,
  ): Promise<any> {
    return axios({
      baseURL: this.endpoint,
      url,
      params: {
        account_id: account,
        since_block_timestamp: since,
      },
    }).then(r => r.data[0].result);
  }

  public async getGasTokensSpent(params: SingleParams): Promise<string> {
    return this.getSingle('gas-tokens-spent', params);
  }

  public async getGasSpent(params: SingleParams): Promise<string> {
    return this.getSingle('gas-spent', params);
  }

  public async getTransactionCount(params: SingleParams): Promise<number> {
    return this.getSingle('transaction-count', params);
  }
}
