export type RpcResponse<T extends RpcResult> = {
  jsonrpc: '2.0';
} & (
  | {
      id: string | number;
      result: T;
    }
  | {
      id: string | number | null;
      error: {
        code: number;
        message: string;
      };
    }
);

export type RpcResult = AccountView;
export type AccountView = {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
  storage_paid_at: number;
  block_height: number;
  block_hash: string;
};
