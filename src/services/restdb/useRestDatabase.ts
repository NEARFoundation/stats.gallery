import { RestDatabaseClient } from './RestDatabaseClient';
import { IRestDatabaseConfiguration } from './networks';

export function useRestDatabase(configuration: IRestDatabaseConfiguration) {
  const client = new RestDatabaseClient(configuration);

  return {
    client,
  };
}
