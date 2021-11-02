<template>
  <main class="flex-grow flex flex-col space-y-3">
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
        <div class="flex justify-end items-center space-x-2">
          <MultiFilterButton
            v-model="directionFilter"
            class="w-32"
            label="Direction"
            :items="['All', ...directions]"
            :highlight="e => e !== 'All'"
          />
          <MultiFilterButton
            v-model="actionKindFilter"
            class="w-48"
            label="Type"
            :items="['All', ...actionKinds]"
            :display="x => (x === 'All' ? x : humanizeActionKind(x))"
            :highlight="e => e !== 'All'"
          />
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
                class="
                  flex flex-col
                  divide-y divide-gray-100
                  dark:divide-gray-700
                  mt-2
                  truncate
                "
              >
                <template v-for="(action, i) in group.actions" :key="i">
                  <ActionLine :action="action" />
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
import Chart from '@/components/Chart.vue';
import MultiFilterButton from '@/components/form/MultiFilterButton.vue';
import { DonutSlice, useDonutChart } from '@/composables/charts/useDonutChart';
import { useNear } from '@/composables/useNear';
import { useTransactionActions } from '@/composables/useTransactionActions';
import {
  ActionKind,
  UnifiedTransactionAction,
} from '@/services/near/indexer/types';
import { humanizeActionKind } from '@/utils/humanize';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { DateTime } from 'luxon';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from './overview/DashboardCard.vue';
import ActionLine from './transactions/ActionLine.vue';

const enum TransactionDirection {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
  Reflexive = 'Reflexive',
}

export default defineComponent({
  components: {
    DashboardCard,
    Chart,
    ActionLine,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    MultiFilterButton,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useTransactionActions({ account, network, timeframe });

    const incoming = ref(0);
    const outgoing = ref(0);
    const reflexive = ref(0);

    const slices = ref([] as DonutSlice[]);

    const actionKinds: ActionKind[] = [
      ActionKind.FUNCTION_CALL,
      ActionKind.TRANSFER,
      ActionKind.STAKE,
      ActionKind.ADD_KEY,
      ActionKind.DELETE_KEY,
      ActionKind.DEPLOY_CONTRACT,
      ActionKind.CREATE_ACCOUNT,
      ActionKind.DELETE_ACCOUNT,
    ];

    const actionKindFilter = ref('All' as 'All' | ActionKind);

    const directions: TransactionDirection[] = [
      TransactionDirection.Incoming,
      TransactionDirection.Outgoing,
      TransactionDirection.Reflexive,
    ];

    const directionFilter = ref('All' as 'All' | TransactionDirection);

    const filterAction = (action: UnifiedTransactionAction) =>
      (actionKindFilter.value === 'All' ||
        actionKindFilter.value === action.action_kind) &&
      (directionFilter.value === 'All' ||
        (directionFilter.value === TransactionDirection.Incoming &&
          action.signer_account_id !== account.value &&
          action.receiver_account_id === account.value) ||
        (directionFilter.value === TransactionDirection.Outgoing &&
          action.signer_account_id === account.value &&
          action.receiver_account_id !== account.value) ||
        (directionFilter.value === TransactionDirection.Reflexive &&
          action.signer_account_id === account.value &&
          action.receiver_account_id === account.value));

    watch(
      [actions, account],
      ([actions, account]) => {
        const totals = {
          incoming: 0,
          outgoing: 0,
          reflexive: 0,
        };

        actions.forEach(action => {
          if (
            action.signer_account_id !== account &&
            action.receiver_account_id === account
          ) {
            totals.incoming++;
          } else if (
            action.signer_account_id === account &&
            action.receiver_account_id !== account
          ) {
            totals.outgoing++;
          } else {
            totals.reflexive++;
          }
        });

        incoming.value = totals.incoming;
        outgoing.value = totals.outgoing;
        reflexive.value = totals.reflexive;

        slices.value = [
          {
            name: 'Incoming',
            value: totals.incoming,
            color: 'rgb(251, 191, 36)',
          },
          {
            name: 'Reflexive',
            value: totals.reflexive,
            color: 'rgb(45, 178, 95)',
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

    watch([actions, actionKindFilter, directionFilter], ([actions]) => {
      const grouped = [];
      for (let i = 0; i < actions.length; i++) {
        const start = startOfDate(actions[i].block_timestamp);
        const group = {
          date: start.toISODate(),
          dateText: start.toLocaleString(DateTime.DATE_FULL),
          actions: [] as UnifiedTransactionAction[],
        };

        let j = i;
        for (; j < actions.length; j++) {
          const action = actions[j];
          const date = startOfDate(action.block_timestamp).toISODate();
          if (date === group.date) {
            if (filterAction(action)) {
              group.actions.push(action);
            }
          } else {
            break;
          }
        }

        i = j - 1;

        if (group.actions.length > 0) {
          grouped.push(group);
        }
      }

      groupedByDate.value = grouped;
    });

    return {
      transactionTypeOption,
      actions,
      incoming,
      outgoing,
      groupedByDate,
      actionKinds,
      directions,
      humanizeActionKind,
      actionKindFilter,
      directionFilter,
    };
  },
});
</script>
