import { PostgrestClient } from '@supabase/postgrest-js';
import { DateTime } from 'luxon';
import { Network, networks } from './networks';
import { IPrestRequest, prestRequest } from './prestRequest';
import { IAccessKey, ITransaction } from './types';

export class NearClient {
  private restClient: PostgrestClient;
  private _network: Network;
  public get network(): Network {
    return this._network;
  }
  public set network(network: Network) {
    this.restClient = new PostgrestClient(networks[network].restEndpoint);
    this._network = network;
  }

  private get prestEndpoint() {
    return networks[this.network].prestEndpoint;
  }

  public constructor(network: Network) {
    this.restClient = new PostgrestClient(networks[network].restEndpoint);
    this._network = network;
  }

  private async fetchRequest<T>(request: IPrestRequest<T>): Promise<T[]> {
    return (await fetch(prestRequest<T>(this.prestEndpoint, request))).json();
  }

  public async getAccessKeys(account: string): Promise<IAccessKey[]> {
    return this.fetchRequest<IAccessKey>({
      table: 'access_keys',
      select: '*',
      where: {
        account_id: account,
      },
    });
  }

  public async getTransactions<
    K extends Pick<
      ITransaction,
      | 'block_timestamp'
      | 'signer_account_id'
      | 'transaction_hash'
      | 'included_in_block_hash'
      | 'included_in_chunk_hash'
      | 'receiver_account_id'
    >,
  >({
    account,
    sinceBlockTimestamp = DateTime.now().minus({ days: 1 }).toMillis() *
      1_000_000,
    limit = 20,
  }: {
    account: string;
    sinceBlockTimestamp?: number;
    limit?: number;
  }): Promise<K[]> {
    const columns: (keyof K)[] = [
      'block_timestamp',
      'signer_account_id',
      'transaction_hash',
      'included_in_block_hash',
      'included_in_chunk_hash',
      'receiver_account_id',
    ];
    return this.fetchRequest({
      table: 'transactions',
      select: columns,
      where: {
        signer_account_id: account,
        block_timestamp: {
          op: 'gte',
          value: sinceBlockTimestamp,
        },
      },
      order: [
        {
          field: 'block_timestamp',
          desc: true,
        },
      ],
      limit,
    });
  }
}
