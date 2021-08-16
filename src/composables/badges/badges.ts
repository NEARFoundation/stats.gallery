import { BadgeComposable } from './BadgeComposable';
import { createBadgeComposable } from './createBadgeComposable';

export type BadgeGroup = 'nft' | 'transfer' | 'contract' | 'stake';

export interface IBadgeDescriptor {
  name: string;
  description: string;
  rarityFraction: number;
  group: BadgeGroup;
  composable: BadgeComposable;
}

export const badges: IBadgeDescriptor[] = [
  {
    name: 'One-of-a-kind',
    description: 'Receive an NFT',
    rarityFraction: 0.017766,
    group: 'nft',
    composable: createBadgeComposable('badge-nft'),
  },
  {
    name: 'Join the party!',
    description: 'Perform a token transfer',
    rarityFraction: 0.44491,
    group: 'transfer',
    composable: createBadgeComposable('badge-transfer', 1),
  },
  {
    name: 'Raining',
    description: 'Transfer tokens 10 times',
    rarityFraction: 0.0084142,
    group: 'transfer',
    composable: createBadgeComposable('badge-transfer', 10),
  },
  {
    name: 'Powertrain',
    description: 'Transfer tokens 100 times',
    rarityFraction: 0.00063829,
    group: 'transfer',
    composable: createBadgeComposable('badge-transfer', 100),
  },
  {
    name: 'ca$h flow',
    description: 'Stake tokens with a validator',
    rarityFraction: 0.038507,
    group: 'stake',
    composable: createBadgeComposable('badge-stake'),
  },
  {
    name: 'I am Web 3',
    description: 'Deploy a smart contract',
    rarityFraction: 0.011375,
    group: 'contract',
    composable: createBadgeComposable('badge-deploy'),
  },
];
