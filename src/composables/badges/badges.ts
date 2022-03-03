export type BadgeGroup = 'nft' | 'transfer' | 'contract' | 'stake';

export interface IBadgeDescriptor {
  attained_value: number;
  badge_group_id: string;
  badge_name: string;
  badge_description: string;
  rarity_fraction: number;
  required_value: number;
  group: BadgeGroup;
  achieved: boolean;
}
