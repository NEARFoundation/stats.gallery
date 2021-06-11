import postgrester from 'postgrester';
export { networkConfigurations } from './networks.config';
import { INetworkConfiguration } from './networks.config';
import { PostgresterInstance } from 'postgrester/dist/types';
import { IAccessKey } from './types';

export class NetworkDatabase {
  private client: PostgresterInstance;

  public constructor(configuration: INetworkConfiguration) {
    this.client = postgrester.create({
      axiosConfig: {
        baseURL: configuration.endpoint,
      },
    });
  }

  public async getAccessKeys(account: string): Promise<IAccessKey[]> {
    return (
      (
        await this.client
          .select('*')
          .eq('account_id', account)
          // .lt('last_update_block_height', 27373257)
          .get('access_keys')
      ).data
    );
  }
}
