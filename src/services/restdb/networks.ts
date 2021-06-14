export const enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export interface IRestDatabaseConfiguration {
  name: string;
  endpoint: string;
}

export const networks: Record<Network, IRestDatabaseConfiguration> = {
  mainnet: {
    name: 'mainnet',
    endpoint: 'https://near-mainnet-postgrest.onrender.com/',
  },
  testnet: {
    name: 'testnet',
    endpoint: 'https://near-testnet-postgrest.onrender.com/',
  },
};
