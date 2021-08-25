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

export function humanizeLevel(level: number): string {
  switch (level) {
    case 1:
      return 'Beginner';
    case 2:
      return 'Rookie';
    case 3:
      return 'Squire';
    case 4:
      return 'Apprentice';
    case 5:
      return 'Knight';
    case 6:
      return 'Warrior';
    case 7:
      return 'Veteran';
    case 8:
      return 'Ninja';
    case 9:
      return 'Elite';
    default:
      return 'Nearkat';
  }
}
