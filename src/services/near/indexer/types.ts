export const enum PermissionKind {
  FULL_ACCESS = 'FULL_ACCESS',
  FUNCTION_CALL = 'FUNCTION_CALL',
}

export const enum ActionKind {
  ADD_KEY = 'ADD_KEY',
  DEPLOY_CONTRACT = 'DEPLOY_CONTRACT',
  DELETE_KEY = 'DELETE_KEY',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  FUNCTION_CALL = 'FUNCTION_CALL',
  TRANSFER = 'TRANSFER',
  STAKE = 'STAKE',
}

export interface IAccessKey {
  public_key: string;
  account_id: string;
  created_by_receipt_id: string;
  deleted_by_receipt_id: string | null;
  permission_kind: PermissionKind;
  last_update_block_height: number;
}

export interface IBlock {
  block_height: number;
  block_hash: string;
  prev_block_hash: string;
  block_timestamp: number;
  total_supply: string;
  gas_price: string;
  author_account_id: string;
}

export const enum ReceiptKind {
  ACTION = 'ACTION',
  DATA = 'DATA',
}

export interface IReceipt {
  receipt_id: string;
  included_in_block_hash: string;
  included_in_chunk_hash: string;
  index_in_chunk: number;
  included_in_block_timestamp: number;
  predecessor_account_id: string;
  receiver_account_id: string;
  receipt_kind: ReceiptKind;
  originated_from_transaction_hash: string;
}

export interface ITransaction {
  transaction_hash: string;
  included_in_block_hash: string;
  included_in_chunk_hash: string;
  index_in_chunk: number;
  block_timestamp: number;
  signer_account_id: string;
  signer_public_key: string;
  nonce: number;
  receiver_account_id: string;
  signature: string;
  status: string;
  converted_into_receipt_id: string;
  receipt_conversion_gas_burnt: number;
  receipt_conversion_tokens_burnt: number;
}

export interface IFunctionCallArgs {
  gas: number;
  deposit: string;
  args_base64: string;
  method_name: string;
}

export interface IAddKeyArgs {
  access_key: {
    nonce: number;
    permission:
      | {
          permission_kind: PermissionKind.FULL_ACCESS;
        }
      | {
          permission_kind: PermissionKind.FUNCTION_CALL;
          permission_details: {
            allowance: string;
            receiver_id: string;
            method_names: string[];
          };
        };
  };
  public_key: string;
}

export interface IDeployContractArgs {
  code_sha256: string;
}

export interface IDeleteKeyArgs {
  public_key: string;
}

export interface IDeleteAccountArgs {
  beneficiary_id: string;
}

export type ICreateAccountArgs = Record<string, never>;

export interface ITransferArgs {
  deposit: string;
}

export interface IStakeArgs {
  stake: string;
  public_key: string;
}

export type ActionArgs =
  | IFunctionCallArgs
  | IAddKeyArgs
  | IDeployContractArgs
  | IDeleteKeyArgs
  | IDeleteAccountArgs
  | ICreateAccountArgs
  | ITransferArgs
  | IStakeArgs;

export interface ITransactionAction<T extends ActionArgs> {
  transaction_hash: string;
  index_in_transaction: number;
  action_kind: ActionKind;
  args: T;
}

export type UnifiedTransactionAction = ITransactionAction<ActionArgs> &
  Pick<
    ITransaction,
    | 'block_timestamp'
    | 'signer_account_id'
    | 'receiver_account_id'
    | 'included_in_block_hash'
  > & {
    receipt_included_in_block_hash: string;
    receipt_included_in_block_height: number;
  };

export type ReceiptAction<K extends ActionKind = ActionKind> = {
  receipt_id: string;
  index_in_action_receipt: number;
  transaction_hash: string;
  action_kind: K;
  args: K extends ActionKind.ADD_KEY
    ? IAddKeyArgs
    : K extends ActionKind.CREATE_ACCOUNT
    ? ICreateAccountArgs
    : K extends ActionKind.DELETE_ACCOUNT
    ? IDeleteAccountArgs
    : K extends ActionKind.DELETE_KEY
    ? IDeleteKeyArgs
    : K extends ActionKind.DEPLOY_CONTRACT
    ? IDeployContractArgs
    : K extends ActionKind.FUNCTION_CALL
    ? IFunctionCallArgs
    : K extends ActionKind.STAKE
    ? IStakeArgs
    : K extends ActionKind.TRANSFER
    ? ITransferArgs
    : never;
  block_hash: string;
  block_timestamp: number;
  predecessor_account_id: string;
  receiver_account_id: string;
};

export function isActionOfKind<T extends ActionKind>(
  x: ReceiptAction<any>,
  k: T,
): x is ReceiptAction<T> {
  return x.action_kind === k;
}

export interface CachedAccountRecord {
  account_id: string;
  balance: string;
  score: number;
}

export interface NearWeekCachedStats {
  account_id: string;
  number_of_transactions: number;
}
