import { Network, networks } from '@/services/near/indexer/networks';
import { isString } from '@/utils/is';
import axios from 'axios';
import { Cache } from '@/services/near/cache';
import { AccountView, RpcResponse } from './types';

export type AccountViewQuery = {
  account: string;
} & ({ blockId: string | number } | { finality: 'optimistic' | 'final' });

export class RpcClient {
  public static from(network: Network): RpcClient {
    return new RpcClient(network);
  }

  private get endpoint(): string {
    return networks[this.network].rpc;
  }

  constructor(public network: Network) {}

  private rpcViewAccount(
    query: AccountViewQuery,
  ): Promise<RpcResponse<AccountView>> {
    return axios({
      url: this.endpoint,
      method: 'POST',
      data: {
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_account',
          account_id: query.account,
          block_id: 'blockId' in query ? query.blockId : undefined,
          finality: 'finality' in query ? query.finality : undefined,
        },
      },
    }).then(v => v.data);
  }

  private async cacheViewAccount(
    query: AccountViewQuery,
  ): Promise<AccountView | undefined> {
    if ('blockId' in query && isString(query.blockId)) {
      return Cache.from(this.network).getView(query.account, query.blockId);
    } else {
      return undefined;
    }
  }

  public async viewAccount(
    query: AccountViewQuery,
  ): Promise<RpcResponse<AccountView>> {
    const fromCache = await this.cacheViewAccount(query);
    if (fromCache !== undefined) {
      return {
        id: 'dontcare',
        jsonrpc: '2.0',
        result: fromCache,
      };
    } else {
      const r = await this.rpcViewAccount(query);
      if ('result' in r) {
        Cache.from(this.network).putView(query.account, r.result);
      }
      return r;
    }
  }
}
