export const enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export function isNetwork(x: unknown): x is Network {
  return x === Network.MAINNET || x === Network.TESTNET;
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
