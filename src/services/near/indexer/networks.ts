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
    indexer: process.env['VUE_APP_INDEXER_MAINNET'] ?? '',
    rpc: process.env['VUE_APP_RPC_MAINNET'] ?? '',
    explorer: process.env['VUE_APP_EXPLORER_MAINNET'] ?? '',
  },
  testnet: {
    name: Network.TESTNET,
    indexer: process.env['VUE_APP_INDEXER_TESTNET'] ?? '',
    rpc: process.env['VUE_APP_RPC_TESTNET'] ?? '',
    explorer: process.env['VUE_APP_EXPLORER_TESTNET'] ?? '',
  },
};
