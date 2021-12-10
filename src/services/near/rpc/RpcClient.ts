import { Network, networks } from '@/services/near/indexer/networks';
import { isString } from '@/utils/is';
import axios from 'axios';
import { Cache } from '@/services/near/cache';
import { AccountView, CodeView, RpcResponse } from './types';

export type AccountViewQuery = {
  account: string;
} & ({ blockId: string | number } | { finality: 'optimistic' | 'final' });

export class RpcClient {
  // Consider final views fresh for 2 minutes
  private static readonly FINAL_VIEW_EXPIRE = 1000 * 60 * 2;

  public static from(network: Network): RpcClient {
    return new RpcClient(network);
  }

  private get endpoint(): string {
    return networks[this.network].rpc;
  }

  constructor(public network: Network) {}

  public viewCode(query: AccountViewQuery): Promise<RpcResponse<CodeView>> {
    return axios({
      url: this.endpoint,
      method: 'POST',
      data: {
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_code',
          account_id: query.account,
          block_id: 'blockId' in query ? query.blockId : undefined,
          finality: 'finality' in query ? query.finality : undefined,
        },
      },
    }).then(v => v.data);
  }

  private getAccountViewFromRpc(
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

  private async getAccountViewFromCache(
    query: AccountViewQuery,
  ): Promise<AccountView | undefined> {
    if ('blockId' in query && isString(query.blockId)) {
      // Regular, by-block-id cache
      return Cache.from(this.network).getView(query.account, query.blockId);
    } else if ('finality' in query) {
      // The latest account view is requested
      const r = await Cache.from(this.network).getFinalView(query.account);
      if (
        r &&
        // Only use the most recent views
        Date.now() - r.timestamp.getTime() < RpcClient.FINAL_VIEW_EXPIRE
      ) {
        return r;
      }
    }

    return undefined;
  }

  public async viewAccount(
    query: AccountViewQuery,
  ): Promise<RpcResponse<AccountView>> {
    const fromCache = await this.getAccountViewFromCache(query);
    if (fromCache !== undefined) {
      return {
        id: 'dontcare',
        jsonrpc: '2.0',
        result: fromCache,
      };
    } else {
      const r = await this.getAccountViewFromRpc(query);

      if ('result' in r) {
        if ('finality' in query) {
          Cache.from(this.network).putFinalView(
            query.account,
            new Date(),
            r.result,
          );
        }

        Cache.from(this.network).putView(query.account, r.result);
      }
      return r;
    }
  }
}
