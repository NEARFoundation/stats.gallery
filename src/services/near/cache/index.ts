import { Network } from '@/services/near/indexer/networks';
import { IDBPDatabase, openDB } from 'idb';
import { RequestParams } from '../indexer/IndexerClient';
import { Action } from '../indexer/types';
import { AccountView } from '../rpc/types';
import {
  IndexSchema,
  INDEX_SCHEMA_VERSION,
  Schema,
  SCHEMA_VERSION,
} from './schema';

export class Cache {
  public static from(network: Network): Cache {
    return new Cache(network);
  }

  private _network: Network = Network.MAINNET;
  private db: Promise<IDBPDatabase<Schema>> = Promise.resolve(
    null as unknown as IDBPDatabase<Schema>,
  );
  private index: Promise<IDBPDatabase<IndexSchema>> = openDB(
    '__index',
    INDEX_SCHEMA_VERSION,
    {
      upgrade(db) {
        db.createObjectStore('databases', {
          keyPath: 'name',
        });
      },
    },
  );

  public set network(value: Network) {
    this._network = value;
    this.index.then(index => {
      index.put('databases', {
        name: this.network,
        version: SCHEMA_VERSION,
      });
    });

    this.db = openDB(this.network, SCHEMA_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        if (oldVersion < 1) {
          const action = db.createObjectStore('action', {
            keyPath: ['receipt_id', 'index_in_action_receipt'],
          });
          action.createIndex('predecessor', 'predecessor_account_id');
          action.createIndex('receiver', 'receiver_account_id');

          db.createObjectStore('action_range', {
            keyPath: 'account_id',
          });

          const view = db.createObjectStore('view', {
            keyPath: ['account_id', 'block_hash'],
          });
          view.createIndex('account', 'account_id');
          view.createIndex('block_hash', 'block_hash');
        }

        if (oldVersion < 2) {
          db.createObjectStore('final_view', {
            keyPath: 'account_id',
          });
        }
      },
    });
  }

  public get network(): Network {
    return this._network;
  }

  public constructor(network: Network) {
    this.network = network;
  }

  public async putActions({
    actions,
    params,
  }: {
    actions: Action[];
    params: RequestParams;
  }): Promise<void> {
    const db = await this.db;
    const tx = db.transaction(['action', 'action_range'], 'readwrite');
    const updateOldest = tx
      .objectStore('action_range')
      .get(params.account)
      .then(r => {
        if (
          params.after !== undefined &&
          ((r && r.after > params.after) || r === undefined)
        ) {
          tx.objectStore('action_range').put({
            account_id: params.account,
            after: params.after,
            before: params.before,
          });
        }
      });
    await Promise.all([
      ...actions.map(action => {
        tx.objectStore('action').put(action);
      }),
      updateOldest,
    ]);
    return tx.done;
  }

  public async getActionRange(
    account: string,
  ): Promise<{ after: number; before: number } | undefined> {
    const db = await this.db;
    return await db.get('action_range', account);
  }

  public async getActions(params: RequestParams): Promise<Action[]> {
    const db = await this.db;
    const predecessor = db.getAllFromIndex(
      'action',
      'predecessor',
      params.account,
    );
    const receiver = db.getAllFromIndex('action', 'receiver', params.account);
    const nonunique = (await Promise.all([predecessor, receiver])).flat();
    const uniqueMap = new Map<string, Action>();
    nonunique.forEach(action => {
      if (
        action.block_timestamp >= params.after &&
        action.block_timestamp < params.before
      ) {
        uniqueMap.set(
          action.receipt_id + '-' + action.index_in_action_receipt,
          action,
        );
      }
    });
    const uniqueSortedArray = Array.from(uniqueMap.values()).sort(
      (a, b) => b.block_timestamp - a.block_timestamp,
    );
    return uniqueSortedArray;
  }

  public async getView(
    account: string,
    blockHash: string,
  ): Promise<AccountView | undefined> {
    const db = await this.db;
    return db.get('view', [account, blockHash]);
  }

  public async putView(account: string, view: AccountView): Promise<void> {
    const db = await this.db;
    await db.put('view', { ...view, account_id: account });
  }

  public async getFinalView(
    account: string,
  ): Promise<(AccountView & { timestamp: Date }) | undefined> {
    const db = await this.db;
    return db.get('final_view', account);
  }

  public async putFinalView(
    account: string,
    timestamp: Date,
    view: AccountView,
  ): Promise<void> {
    const db = await this.db;
    await db.put('final_view', { ...view, timestamp, account_id: account });
  }
}
