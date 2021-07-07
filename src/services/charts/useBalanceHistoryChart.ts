import { UnifiedTransactionAction } from '@/services/near/indexer/types';
import { toNear } from '@/utils/near';
import {
  ComposeOption,
  LineSeriesOption,
  TooltipComponentOption,
} from 'echarts';
import { DateTime } from 'luxon';
import { ref, Ref, watch } from 'vue';
import { RpcResponse, RpcViewAccountResult } from '../near/rpc/types';

type Option = ComposeOption<LineSeriesOption | TooltipComponentOption>;

export function useBalanceHistoryChart({
  actions,
  views,
  final,
}: {
  actions: Ref<UnifiedTransactionAction[]>;
  views: Ref<RpcResponse<RpcViewAccountResult>[]>;
  final?: {
    amount: string;
    timestamp: number;
  };
}): Ref<Option> {
  const makeData = () => {
    const recorded = actions.value.flatMap((action, i) => {
      const view = views.value[i];
      if (action && view && 'result' in view) {
        const time = DateTime.fromMillis(action.block_timestamp / 1_000_000);
        return [
          {
            name: time.toLocaleString(DateTime.DATETIME_MED),
            value: [time.toISO(), toNear(view.result.amount).toString()],
          },
        ];
      } else {
        return [];
      }
    });

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
        trigger: 'item',
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
          areaStyle: {},
          data: g,
        },
      ],
    } as Option;
  };

  const option = ref(genOption());

  watch([actions, views], () => {
    option.value = genOption();
  });

  return option;
}
