export const enum PermissionKind {
  FULL_ACCESS = 'FULL_ACCESS',
  FUNCTION_CALL = 'FUNCTION_CALL',
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
