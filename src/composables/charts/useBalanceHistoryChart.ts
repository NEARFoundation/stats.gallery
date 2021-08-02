import { Action } from '@/services/near/indexer/types';
import { toNear } from '@/utils/near';
import {
  ComposeOption,
  LineSeriesOption,
  TooltipComponentOption,
} from 'echarts';
import { DateTime } from 'luxon';
import { ref, Ref, watch } from 'vue';
import { AccountView } from '../../services/near/rpc/types';

type Option = ComposeOption<LineSeriesOption | TooltipComponentOption>;

export function useBalanceHistoryChart({
  actions,
  views,
  initial,
  final,
}: {
  actions: Ref<Action[]>;
  views: Ref<(AccountView | undefined)[]>;
  initial?: {
    amount: string;
    timestamp: number;
  };
  final?: {
    amount: string;
    timestamp: number;
  };
}): Ref<Option> {
  const makeData = () => {
    const recorded = actions.value.flatMap((action, i) => {
      const view = views.value[i];
      if (action && view) {
        const time = DateTime.fromMillis(action.block_timestamp / 1_000_000);
        return [
          {
            name: time.toLocaleString(DateTime.DATETIME_MED),
            value: [time.toISO(), toNear(view.amount).toString()],
          },
        ];
      } else {
        return [];
      }
    });

    if (initial) {
      const time = DateTime.fromMillis(initial.timestamp / 1_000_000);
      recorded.push({
        name: time.toLocaleString(DateTime.DATETIME_MED),
        value: [time.toISO(), toNear(initial.amount).toString()],
      });
    }

    if (final) {
      const time = DateTime.fromMillis(final.timestamp / 1_000_000);
      recorded.unshift({
        name: time.toLocaleString(DateTime.DATETIME_MED),
        value: [time.toISO(), toNear(final.amount).toString()],
      });
    }

    return recorded;
  };

  const genOption: () => Option = () => {
    const g = makeData();
    return {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter(value: number) {
            return DateTime.fromMillis(value).toLocaleString(
              DateTime.DATE_SHORT,
            );
          },
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Accounts',
          type: 'line',
          step: 'start',
          showSymbol: false,
          color: 'rgb(124, 58, 237)',
          areaStyle: {
            color: 'rgb(139, 92, 246)',
          },
          data: g,
        },
      ],
    } as Option;
  };

  const option = ref(genOption());

  watch([actions, views, initial, final], () => {
    option.value = genOption();
  });

  return option;
}
