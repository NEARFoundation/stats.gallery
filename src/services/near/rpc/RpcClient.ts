import axios from 'axios';
import { Network, networks } from '../indexer/networks';

export type RpcResponse<T extends RpcResult> = {
  jsonrpc: '2.0';
} & (
  | {
      id: string | number;
      result: T;
    }
  | {
      id: string | number | null;
      error: {
        code: number;
        message: string;
      };
    }
);

export type RpcResult = RpcViewAccountResult;
export type RpcViewAccountResult = {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
  storage_paid_at: number;
  block_height: number;
  block_hash: string;
};

export class RpcClient {
  private get endpoint(): string {
    return networks[this.network].rpc;
  }

  constructor(public network: Network) {}

  public async viewAccount(
    query: {
      account: string;
    } & ({ blockId: string | number } | { finality: 'optimistic' | 'final' }),
  ): Promise<RpcResponse<RpcViewAccountResult>> {
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
