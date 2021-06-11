import { RestDatabaseClient } from './RestDatabaseClient';
import { IRestDatabaseConfiguration } from './networks.config';

export function useRestDatabase(configuration: IRestDatabaseConfiguration) {
  const client = new RestDatabaseClient(configuration);

  return {
    client,
  };
}
