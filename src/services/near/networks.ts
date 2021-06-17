export const enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export interface INetworkConfiguration {
  name: Network;
  restEndpoint: string;
  prestEndpoint: string;
}

export const networks: Record<Network, INetworkConfiguration> = {
  mainnet: {
    name: Network.MAINNET,
    restEndpoint: 'https://near-mainnet-postgrest.onrender.com',
    prestEndpoint: 'http://localhost:3000/mainnet_explorer/public/',
  },
  testnet: {
    name: Network.TESTNET,
    restEndpoint: 'https://near-testnet-postgrest.onrender.com',
    prestEndpoint: 'http://localhost:3001/testnet_explorer/public/',
  },
};
