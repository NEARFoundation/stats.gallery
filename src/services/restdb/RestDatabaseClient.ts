import { PostgrestClient } from '@supabase/postgrest-js';
import { DateTime } from 'luxon';
import { Network, networks } from './networks';
import { IAccessKey, ITransaction } from './types';

export class RestDatabaseClient {
  private client: PostgrestClient;
  private _network: Network;
  public get network(): Network {
    return this._network;
  }
  public set network(network: Network) {
    this.client.url = networks[network].endpoint;
    this._network = network;
  }

  public constructor(network: Network) {
    this.client = new PostgrestClient(networks[network].endpoint);
    this._network = network;
  }

  public async getAccessKeys(account: string): Promise<IAccessKey[]> {
    return (
      await this.client
        .from('access_keys')
        .select('*')
        .eq('account_id', account)
    ).data as IAccessKey[];
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

    return (
      await this.client
        .from('transactions')
        .select(columns.join(','))
        .eq('signer_account_id', account)
        .gte('block_timestamp', sinceBlockTimestamp)
        .order('block_timestamp', {
          ascending: false,
        })
        .limit(limit)
    ).data as K[];
  }
}
