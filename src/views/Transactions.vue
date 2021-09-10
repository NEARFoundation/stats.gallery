<template>
  <main class="flex-grow flex flex-col space-y-3 w-4/5">
    <DashboardCard title="Transactions">
      <div class="flex flex-col space-y-3 p-3">
        <!-- aggregate stats wrapper -->
        <div class="flex flex-col md:flex-row space-x-3">
          <!-- header + legend wrapper -->
          <div class="flex-grow flex flex-col items-center space-y-3 my-12">
            <!-- # transactions header -->
            <h3 class="text-2xl font-bold">
              {{ $filters.number.standard(actions.length) }} transaction{{
                actions.length !== 1 ? 's' : ''
              }}
            </h3>
            <!-- legend -->
            <div class="flex space-x-3 w-64">
              <div class="w-10 h-6 bg-yellow-400 rounded"></div>
              <span class="flex-grow">Incoming</span>
              <span class="font-bold">{{
                $filters.number.standard(incoming)
              }}</span>
            </div>
            <div class="flex space-x-3 w-64">
              <div class="w-10 h-6 bg-blue-600 rounded"></div>
              <span class="flex-grow">Outgoing</span>
              <span class="font-bold">{{
                $filters.number.standard(outgoing)
              }}</span>
            </div>
          </div>
          <div class="w-1/2">
            <Chart class="chart" :option="transactionTypeOption" autoresize />
          </div>
        </div>
        <!-- show filter -->
        <div
          class="flex justify-end items-center space-x-2 flex-wrap space-y-3"
        >
          <span class="font-medium">Show:</span>
          <ToggleButton
            :modelValue="showFilter === 'all'"
            @update:modelValue="showFilter = 'all'"
            >All</ToggleButton
          >
          <ToggleButton
            :modelValue="showFilter === 'incoming'"
            @update:modelValue="showFilter = 'incoming'"
            >Incoming</ToggleButton
          >
          <ToggleButton
            :modelValue="showFilter === 'outgoing'"
            @update:modelValue="showFilter = 'outgoing'"
            >Outgoing</ToggleButton
          >
          <ToggleButton
            :modelValue="showFilter === 'function_call'"
            @update:modelValue="showFilter = 'function_call'"
            >Function Call</ToggleButton
          >
        </div>
        <!-- tx groups list wrapper -->
        <div class="flex flex-col space-y-3">
          <Disclosure
            as="div"
            v-for="group in groupedByDate"
            :key="group.date"
            class="flex flex-col"
            defaultOpen
          >
            <DisclosureButton as="h4" class="flex">
              <button
                class="
                  flex-grow
                  text-left
                  cursor-pointer
                  text-lg
                  font-bold
                  bg-gray-200
                  dark:bg-gray-700
                  hover:bg-gray-300
                  dark:hover:bg-gray-900
                  rounded-md
                  p-3
                  border border-transparent
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-gray-500
                "
              >
                {{ group.dateText }}
              </button>
            </DisclosureButton>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <DisclosurePanel
                class="flex flex-col divide-y divide-gray-100 mt-2 truncate"
              >
                <template v-for="(action, i) in group.actions" :key="i">
                  <ActionLine v-if="filterAction(action)" :action="action" />
                </template>
              </DisclosurePanel>
            </transition>
          </Disclosure>
        </div>
      </div>
    </DashboardCard>
  </main>
</template>

<style scoped></style>

<script lang="ts">
import ToggleButton from '@/components/form/ToggleButton.vue';
import { DonutSlice, useDonutChart } from '@/composables/charts/useDonutChart';
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import {
  ActionKind,
  UnifiedTransactionAction,
} from '@/services/near/indexer/types';
import { DateTime } from 'luxon';
import { defineComponent, ref, watch } from 'vue';
import Chart from '@/components/Chart.vue';
import DashboardCard from './overview/DashboardCard.vue';
import ActionLine from './transactions/ActionLine.vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

export default defineComponent({
  components: {
    DashboardCard,
    Chart,
    ToggleButton,
    ActionLine,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });

    const incoming = ref(0);
    const outgoing = ref(0);
    const slices = ref([] as DonutSlice[]);

    watch(
      [actions, account],
      ([actions, account]) => {
        const totals = {
          incoming: 0,
          outgoing: 0,
        };

        actions.forEach(action => {
          if (action.receiver_account_id === account) {
            totals.incoming++;
          } else {
            totals.outgoing++;
          }
        });

        incoming.value = totals.incoming;
        outgoing.value = totals.outgoing;

        slices.value = [
          {
            name: 'Incoming',
            value: totals.incoming,
            color: 'rgb(251, 191, 36)',
          },
          {
            name: 'Outgoing',
            value: totals.outgoing,
            color: 'rgb(37, 99, 235)',
          },
        ];
      },
      { immediate: true },
    );

    const transactionTypeOption = useDonutChart(slices);

    const groupedByDate = ref(
      [] as { date: string; actions: UnifiedTransactionAction[] }[],
    );

    const startOfDate = (blockTimestamp: number): DateTime =>
      DateTime.fromMillis(blockTimestamp / 1_000_000).startOf('day');

    watch(actions, actions => {
      const grouped = [];
      for (let i = 0; i < actions.length; i++) {
        const start = startOfDate(actions[i].block_timestamp);
        const group = {
          date: start.toISODate(),
          dateText: start.toLocaleString(DateTime.DATE_FULL),
          actions: [actions[i]],
        };

        let j = i + 1;
        for (; j < actions.length; j++) {
          const action = actions[j];
          const date = startOfDate(action.block_timestamp).toISODate();
          if (date === group.date) {
            group.actions.push(action);
          } else {
            break;
          }
        }

        i = j - 1;

        grouped.push(group);
      }

      groupedByDate.value = grouped;
    });

    const showFilter = ref(
      'all' as 'all' | 'incoming' | 'outgoing' | 'function_call',
    );

    const filterAction = (action: UnifiedTransactionAction) =>
      showFilter.value === 'all' ||
      (showFilter.value === 'function_call' &&
        action.action_kind === ActionKind.FUNCTION_CALL) ||
      (showFilter.value === 'incoming' &&
        action.receiver_account_id === account.value) ||
      (showFilter.value === 'outgoing' &&
        action.receiver_account_id !== account.value);

    return {
      showFilter,
      transactionTypeOption,
      actions,
      incoming,
      outgoing,
      groupedByDate,
      filterAction,
    };
  },
});
</script>
