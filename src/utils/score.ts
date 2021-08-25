import {
  ActionKind,
  UnifiedTransactionAction,
} from '@/services/near/indexer/types';

export function getActionScore(
  action: UnifiedTransactionAction,
  account: string,
): number {
  if (action.signer_account_id === account) {
    switch (action.action_kind) {
      case ActionKind.TRANSFER:
        return 10;
      case ActionKind.CREATE_ACCOUNT:
        return 50;
      case ActionKind.FUNCTION_CALL:
        return 10;
      case ActionKind.DEPLOY_CONTRACT:
        return 100;
    }
  } else if (action.receiver_account_id === account) {
    switch (action.action_kind) {
      case ActionKind.TRANSFER:
        return 2;
    }
  }

  return 0;
}
