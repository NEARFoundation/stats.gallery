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
        data: string;
      };
    }
);

export type RpcResult = CodeView | AccountView;

export type CodeView = {
  block_hash: string;
  block_height: number;
  code_base64: string;
  hash: string;
};

export type AccountView = {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
  storage_paid_at: number;
  block_height: number;
  block_hash: string;
};
