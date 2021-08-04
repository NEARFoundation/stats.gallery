import { ActionKind } from '@/services/near/indexer/types';

export function humanizeActionKind(actionKind: ActionKind): string {
  return (
    {
      ADD_KEY: 'Add key',
      CREATE_ACCOUNT: 'Account creation',
      DELETE_ACCOUNT: 'Account deletion',
      DELETE_KEY: 'Delete key',
      DEPLOY_CONTRACT: 'Contract deployment',
      FUNCTION_CALL: 'Function call',
      STAKE: 'Staking',
      TRANSFER: 'Transfer',
    } as Record<ActionKind, string>
  )[actionKind];
}
