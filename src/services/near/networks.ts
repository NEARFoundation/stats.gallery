export const enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export interface INetworkConfiguration {
  name: Network;
  endpoint: string;
}

export const networks: Record<Network, INetworkConfiguration> = {
  mainnet: {
    name: Network.MAINNET,
    endpoint: 'https://near-mainnet-postgrest.onrender.com',
  },
  testnet: {
    name: Network.TESTNET,
    endpoint: 'https://near-testnet-postgrest.onrender.com',
  },
};
