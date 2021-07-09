import { Network, networks } from '@/services/near/indexer/networks';
import axios from 'axios';
import { RpcResponse, AccountView } from './types';

export class RpcClient {
  public static from(network: Network): RpcClient {
    return new RpcClient(network);
  }

  private get endpoint(): string {
    return networks[this.network].rpc;
  }

  constructor(public network: Network) {}

  public async viewAccount(
    query: {
      account: string;
    } & ({ blockId: string | number } | { finality: 'optimistic' | 'final' }),
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
}
