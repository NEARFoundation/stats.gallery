import { Action, ActionKind } from '@/services/near/indexer/types';
import Highcharts from 'highcharts';
import { ref, Ref, watch } from 'vue';

export function useActionTypeChart(
  actions: Ref<Action[]>,
): Ref<Highcharts.Options> {
  const pieSlice = (
    name: string,
    value: number,
    color: string,
  ): Highcharts.PointOptionsObject => ({
    name,
    y: value,
    color,
  });

  const makeData = () => {
    const groups = actions.value.reduce((acc, current) => {
      const ak = current.action_kind;
      if (!acc[ak]) {
        acc[ak] = 0;
      }
      acc[ak]++;
      return acc;
    }, {} as Record<ActionKind, number>);

    return [
      pieSlice('Function Call', groups[ActionKind.FUNCTION_CALL], '#fbbf24'),
      pieSlice('Transfer', groups[ActionKind.TRANSFER], '#ef5da8'),
      pieSlice('Add Key', groups[ActionKind.ADD_KEY], '#60a5fa'),
      pieSlice('Delete Key', groups[ActionKind.DELETE_KEY], '#ef4444'),
      pieSlice('Create Account', groups[ActionKind.CREATE_ACCOUNT], '#12b981'),
      pieSlice('Delete Account', groups[ActionKind.DELETE_ACCOUNT], '#ef4444'),
      pieSlice(
        'Deploy Contract',
        groups[ActionKind.DEPLOY_CONTRACT],
        '#1c4ed8',
      ),
      pieSlice('Stake', groups[ActionKind.STAKE], '#8b5cf6'),
    ];
  };

  const genOption: () => Highcharts.Options = () => ({
    chart: {
      type: 'pie',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      style: {
        fontFamily: 'DM Sans',
        fontWeight: '700',
        fontSize: '18px',
      },
    },
    tooltip: {
      headerFormat: '{point.key}<br />',
      style: {
        fontSize: '16px',
        fontWeight: '400',
      },
    },
    title: {
      text: '',
    },
    plotOptions: {
      pie: {
        dataLabels: {
          style: {
            color: 'rgba(128, 128, 128, 1)',
            fontSize: '16px',
            textOutline: '',
          },
        },
        borderWidth: 0.5,
        borderColor: 'white',
      },
    },
    series: [
      {
        name: 'Actions',
        type: 'pie',
        radius: '50%',
        data: makeData(),
      },
    ],
  });

  const option = ref(genOption());

  watch(actions, () => {
    option.value = genOption();
  });

  return option;
}
