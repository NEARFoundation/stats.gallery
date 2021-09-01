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
    date: DateTime.fromObject({ year: 2021, month: 11, day: 20 }).toJSDate(),
    done: false,
    link: '',
  },
  {
    name: 'Make everything sharable!',
    date: DateTime.fromObject({ year: 2021, month: 9, day: 20 }).toJSDate(),
    done: false,
    link: '',
  },
  {
    name: 'Leaderboards page',
    date: DateTime.fromObject({ year: 2021, month: 9, day: 20 }).toJSDate(),
    done: false,
    link: '',
  },
  {
    name: 'New charts',
    date: DateTime.fromObject({ year: 2021, month: 9, day: 20 }).toJSDate(),
    done: false,
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
    date: DateTime.fromObject({ year: 2021, month: 7, day: 15 }).toJSDate(),
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
