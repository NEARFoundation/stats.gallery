import { DBSchema } from 'idb';
import { ReceiptAction } from '../indexer/types';
import { AccountView } from '../rpc/types';

export const INDEX_SCHEMA_VERSION = 1;

export interface IndexSchema extends DBSchema {
  databases: {
    key: string;
    value: {
      name: string;
      version: number;
    };
  };
}

export const SCHEMA_VERSION = 2;

export interface Schema extends DBSchema {
  view: {
    key: [string, string];
    value: {
      account_id: string;
    } & AccountView;
    indexes: {
      account: string;
      block_hash: string;
    };
  };
  final_view: {
    key: string;
    value: {
      account_id: string;
      timestamp: Date;
    } & AccountView;
  };
  action: {
    key: [string, string];
    value: ReceiptAction;
    indexes: {
      predecessor: string;
      receiver: string;
    };
  };
  action_range: {
    key: string;
    value: {
      account_id: string;
      after: number;
      before: number;
    };
  };
}
