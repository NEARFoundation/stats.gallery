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

export type TransactionActionArgs =
  | IFunctionCallArgs
  | IAddKeyArgs
  | IDeployContractArgs
  | IDeleteKeyArgs
  | IDeleteAccountArgs
  | ICreateAccountArgs
  | ITransferArgs
  | IStakeArgs;

export interface ITransactionAction<T extends TransactionActionArgs> {
  transaction_hash: string;
  index_in_transaction: number;
  action_kind: ActionKind;
  args: T;
}

export type UnifiedTransactionAction =
  ITransactionAction<TransactionActionArgs> &
    Pick<
      ITransaction,
      'block_timestamp' | 'signer_account_id' | 'receiver_account_id'
    >;
