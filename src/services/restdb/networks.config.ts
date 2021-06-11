export interface IRestDatabaseConfiguration {
  name: string;
  endpoint: string;
}

export const configurations: Record<
  'mainnet' | 'testnet',
  IRestDatabaseConfiguration
> = {
  mainnet: {
    name: 'mainnet',
    endpoint: 'https://near-mainnet-postgrest.onrender.com/',
  },
  testnet: {
    name: 'testnet',
    endpoint: 'https://near-testnet-postgrest.onrender.com/',
  },
};
