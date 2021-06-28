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
    endpoint: 'http://localhost:3000/mainnet',
  },
  testnet: {
    name: Network.TESTNET,
    endpoint: 'http://localhost:3000/testnet',
  },
};
