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
    endpoint: process.env['VUE_APP_ENDPOINT_MAINNET'],
  },
  testnet: {
    name: Network.TESTNET,
    endpoint: process.env['VUE_APP_ENDPOINT_TESTNET'],
  },
};
