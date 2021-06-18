import { PostgrestClient } from '@supabase/postgrest-js';
import { DateTime } from 'luxon';
import { Network, networks } from './networks';
import { IPrestRequest, prestRequest } from './prestRequest';
import {
  ActionKind,
  IAccessKey,
  ITransaction,
  ITransactionAction,
  ITransferArgs,
  TransactionActionArgs,
} from './types';

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

  private async fetchRequest<T, W>(request: IPrestRequest<T>): Promise<W[]> {
    return (await fetch(prestRequest<T>(this.prestEndpoint, request))).json();
  }

  public async getAccessKeys(account: string): Promise<IAccessKey[]> {
    return this.fetchRequest<IAccessKey, IAccessKey>({
      table: 'access_keys',
      select: ['*'],
      where: {
        account_id: account,
      },
    });
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
  }): Promise<{ sum: number; action_kind: ActionKind }[]> {
    return await this.fetchRequest({
      table: 'transactions',
      select: ['action_kind'],
      where: {
        signer_account_id: account,
        block_timestamp: {
          op: 'gte',
          value: sinceBlockTimestamp,
        },
      },
      sum: inTokens
        ? 'receipt_conversion_tokens_burnt'
        : 'receipt_conversion_gas_burnt',
      group: ['action_kind'],
      join: {
        table: 'transaction_actions',
        field: 'transaction_hash',
        on: 'transaction_hash',
        type: 'left',
      },
    });
  }

  public async getTransactions<
    T extends Pick<
      ITransaction & ITransactionAction<ITransferArgs>,
      | 'block_timestamp'
      | 'signer_account_id'
      | 'transaction_hash'
      | 'included_in_block_hash'
      | 'receiver_account_id'
      | 'receipt_conversion_gas_burnt'
      | 'receipt_conversion_tokens_burnt'
      | 'status'
      | 'args'
      | 'action_kind'
    >,
  >({
    account,
    sinceBlockTimestamp = DateTime.now().minus({ days: 1 }).toMillis() *
      1_000_000,
    limit = 20,
    action,
  }: {
    account: string;
    sinceBlockTimestamp?: number;
    limit?: number;
    action?: ActionKind[] | ActionKind;
  }): Promise<T[]> {
    return this.fetchRequest<T, T>({
      table: 'transactions',
      select: [
        'block_timestamp',
        'signer_account_id',
        'transactions.transaction_hash',
        'included_in_block_hash',
        'receiver_account_id',
        'receipt_conversion_gas_burnt',
        'receipt_conversion_tokens_burnt',
        'status',
        'action_kind',
        'args',
      ],
      where: {
        signer_account_id: account,
        block_timestamp: {
          op: 'gte',
          value: sinceBlockTimestamp,
        },
        action_kind: action,
      },
      order: [
        {
          field: 'block_timestamp',
          desc: true,
        },
      ],
      join: {
        table: 'transaction_actions',
        field: 'transaction_hash',
        on: 'transaction_hash',
        type: 'left',
      },
      limit,
    });
  }
}
