import { Network } from '@/services/near/indexer/networks';
import { Timeframe } from '@/services/timeframe';
import { StoreOptionsType } from './types';

export interface StoreOptions extends StoreOptionsType {
  state: {
    accountId: string;
    timeframe: Timeframe;
    network: Network;
  };
  mutation: {
    SET_ACCOUNT_ID: {
      accountId: string;
    };
    SET_TIMEFRAME: {
      timeframe: Timeframe;
    };
    SET_NETWORK: {
      network: Network;
    };
  };
  action: {
    SET_ACCOUNT_ID: {
      accountId: string;
    };
    SET_TIMEFRAME: {
      timeframe: Timeframe;
    };
    SET_NETWORK: {
      network: Network;
    };
  };
}

// export interface State {
//   accountId: string;
//   timeframe: Timeframe;
//   network: Network;
// }

// export interface Mutation {
//   SET_ACCOUNT_ID: {
//     accountId: string;
//   };
//   SET_TIMEFRAME: {
//     timeframe: Timeframe;
//   };
//   SET_NETWORK: {
//     network: Network;
//   };
// }

// export interface Action {
//   SET_ACCOUNT_ID: {
//     accountId: string;
//   };
//   SET_TIMEFRAME: {
//     timeframe: Timeframe;
//   };
//   SET_NETWORK: {
//     network: Network;
//   };
// }
