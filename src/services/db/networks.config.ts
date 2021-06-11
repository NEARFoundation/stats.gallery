export interface INetworkConfiguration {
  name: string;
  endpoint: string;
}

export const networkConfigurations: Record<
  'mainnet' | 'testnet',
  INetworkConfiguration
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
