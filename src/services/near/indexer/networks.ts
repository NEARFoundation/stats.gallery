import mainnet from '@/networks/mainnet.json';
import testnet from '@/networks/testnet.json';
import { API_ROOT } from '@/constants';

export const enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export function isNetwork(x: unknown): x is Network {
  return x === Network.MAINNET || x === Network.TESTNET;
}

export interface INetworkConfiguration {
  name: Network;
  indexer: string;
  rpc: string;
  explorer: string;
}

export const networks: Record<Network, INetworkConfiguration> = {
  mainnet: {
    name: Network.MAINNET,
    indexer: API_ROOT + '/mainnet',
    rpc: mainnet.archivalUrl,
    explorer: mainnet.explorerUrl,
  },
  testnet: {
    name: Network.TESTNET,
    indexer: API_ROOT + '/testnet',
    rpc: testnet.archivalUrl,
    explorer: testnet.explorerUrl,
  },
};
