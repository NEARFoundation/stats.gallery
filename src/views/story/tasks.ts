import { DateTime } from 'luxon';

export interface RoadmapTask {
  name: string;
  date: Date;
  done: boolean;
  link: string;
}

export const tasks: RoadmapTask[] = [
  {
    name: 'Community governance',
    date: DateTime.fromObject({ year: 2022, month: 1, day: 31 }).toJSDate(),
    done: false,
    link: '',
  },
  {
    name: 'Sponsored badges',
    date: DateTime.fromObject({ year: 2021, month: 11, day: 22 }).toJSDate(),
    done: false,
    link: 'https://github.com/NEAR-Edu/stats.gallery/issues/37',
  },
  {
    name: 'Dapp integrations',
    date: DateTime.fromObject({ year: 2021, month: 11, day: 21 }).toJSDate(),
    done: false,
    link: 'https://github.com/NEAR-Edu/stats.gallery/issues/41',
  },
  {
    name: 'Account status NFT',
    date: DateTime.fromObject({ year: 2021, month: 10, day: 20 }).toJSDate(),
    done: false,
    link: 'https://github.com/NEAR-Edu/stats.gallery/issues/39',
  },
  {
    name: 'NEAR Login',
    date: DateTime.fromObject({ year: 2021, month: 10, day: 30 }).toJSDate(),
    done: false,
    link: 'https://github.com/NEAR-Edu/stats.gallery/issues/47',
  },
  {
    name: 'New charts',
    date: DateTime.fromObject({ year: 2021, month: 10, day: 29 }).toJSDate(),
    done: false,
    link: '',
  },
  {
    name: 'Leaderboards page',
    date: DateTime.fromObject({ year: 2021, month: 9, day: 20 }).toJSDate(),
    done: true,
    link: '',
  },
  {
    name: 'Make everything sharable!',
    date: DateTime.fromObject({ year: 2021, month: 9, day: 13 }).toJSDate(),
    done: true,
    link: '',
  },
  {
    name: 'Beta release',
    date: DateTime.fromObject({ year: 2021, month: 8, day: 20 }).toJSDate(),
    done: true,
    link: '',
  },
  {
    name: 'Redesign UI',
    date: DateTime.fromObject({ year: 2021, month: 7, day: 16 }).toJSDate(),
    done: true,
    link: '',
  },
  {
    name: 'Release proof-of-concept',
    date: DateTime.fromObject({ year: 2021, month: 7, day: 15 }).toJSDate(),
    done: true,
    link: '',
  },
];
