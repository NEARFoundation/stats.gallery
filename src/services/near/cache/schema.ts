import { DBSchema } from 'idb';
import { Action } from '../indexer/types';
import { AccountView } from '../rpc/types';

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
  view_range: {
    key: string;
    value: {
      account_id: string;
      after: number;
      before: number;
    };
  };
  action: {
    key: [string, string];
    value: Action;
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
