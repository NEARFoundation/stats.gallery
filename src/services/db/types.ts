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
