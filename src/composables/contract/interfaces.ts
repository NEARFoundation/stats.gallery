export interface IStandardInterfaceMethod {
  name: string;
  args: string[];
}

export interface IStandardInterface {
  id: StandardInterfaceId;
  name: string;
  methods: IStandardInterfaceMethod[];
}

export const enum StandardInterfaceId {
  NEP171 = 'nep171',
  NEP177 = 'nep177',
  NEP178 = 'nep178',
}

export const interfaces: Record<StandardInterfaceId, IStandardInterface> = {
  [StandardInterfaceId.NEP171]: {
    id: StandardInterfaceId.NEP171,
    name: 'NFT Core (NEP-171)',
    methods: [
      {
        name: 'nft_transfer',
        args: ['receiver_id', 'token_id', 'approval_id', 'memo'],
      },
      {
        name: 'nft_transfer_call',
        args: ['receiver_id', 'token_id', 'approval_id', 'memo', 'msg'],
      },
      {
        name: 'nft_token',
        args: ['token_id'],
      },
    ],
  },
  [StandardInterfaceId.NEP177]: {
    id: StandardInterfaceId.NEP177,
    name: 'NFT Metadata (NEP-177)',
    methods: [
      {
        name: 'nft_metadata',
        args: [],
      },
    ],
  },
  [StandardInterfaceId.NEP178]: {
    id: StandardInterfaceId.NEP178,
    name: 'NFT Approval Management (NEP-178)',
    methods: [
      {
        name: 'nft_approve',
        args: ['token_id', 'account_id', 'msg'],
      },
      {
        name: 'nft_revoke',
        args: ['token_id', 'account_id'],
      },
      {
        name: 'nft_revoke_all',
        args: ['token_id'],
      },
      {
        name: 'nft_is_approved',
        args: ['token_id', 'approved_account_id', 'approval_id'],
      },
    ],
  },
};

export function getProbableInterfaces(methodNames: string[]): {
  probableInterfaces: StandardInterfaceId[];
  byMethod: Record<string, StandardInterfaceId[]>;
} {
  const probableInterfaces = Object.keys(interfaces).filter(i =>
    interfaces[i as StandardInterfaceId].methods.every(m =>
      methodNames.includes(m.name),
    ),
  ) as StandardInterfaceId[];

  const byMethod: Record<string, StandardInterfaceId[]> = {};
  methodNames.forEach(methodName => {
    byMethod[methodName] = probableInterfaces.filter(i =>
      interfaces[i].methods.map(m => m.name).includes(methodName),
    );
  });

  return { probableInterfaces, byMethod };
}
