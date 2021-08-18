<template>
  <DashboardCard title="Score">
    <template #help>
      Track your activity across the network with a unified score. The more you
      participate, the higher your score grows!
    </template>
    <template #action>
      <button
        @click="modalOpen = true"
        class="
          px-2
          py-1
          bg-white
          rounded-md
          text-sm
          font-medium
          text-gray-500
          shadow
          whitespace-nowrap
          hover:text-gray-800
        "
      >
        How to score?
      </button>
    </template>
    <template #default>
      <HeaderListButtonTemplate
        listTitle="Recent earnings"
        buttonText="View scores"
        :empty="scoringActions.length === 0"
      >
        <template #header>
          <div
            class="
              text-2xl
              font-bold
              text-white
              bg-purple-700
              py-1
              px-4
              rounded-full
            "
          >
            {{ $filters.number.standard(score) }}
          </div>
        </template>
        <template #default>
          <template v-for="(action, i) in scoringActions" :key="i">
            <div class="truncate">
              {{ $filters.humanize.actionKind(action.actionKind) }}
            </div>
            <div class="text-green-500 font-bold">
              +{{ $filters.number.compact(action.score) }}
            </div>
          </template>
        </template>
      </HeaderListButtonTemplate>
      <Modal
        :open="modalOpen"
        @close="modalOpen = false"
        title="How to earn points"
      >
        <p>
          Account score is calculated by a number of factors, primarily
          dependent on the types and quantity of transactions sent and received.
        </p>
        <table>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in scoreTable" :key="entry.name">
              <td>{{ entry.name }}</td>
              <td class="text-green-600 font-bold">+{{ entry.points }}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import Modal from '@/components/Modal.vue';
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { useScore } from '@/composables/useScore';
import { ActionKind } from '@/services/near/indexer/types';
import { getActionScore } from '@/utils/score';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';
import HeaderListButtonTemplate from './HeaderListButtonTemplate.vue';

export default defineComponent({
  components: {
    DashboardCard,
    HeaderListButtonTemplate,
    Modal,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { score, isLoading: isScoreLoading } = useScore({
      account,
      network,
      timeframe,
    });
    const { actions, isLoading: isActionsLoading } = useRecentActions({
      account,
      network,
      timeframe,
    });

    const scoringActions = ref(
      [] as { actionKind: ActionKind; score: number }[],
    );

    watch([actions, account], ([actions, account]) => {
      scoringActions.value = actions
        .map(action => ({
          actionKind: action.action_kind,
          score: getActionScore(action, account),
        }))
        .filter(a => a.score > 0)
        .slice(0, 4);
    });

    const modalOpen = ref(false);

    const scoreTable: {
      name: string;
      points: number;
    }[] = [
      {
        name: 'Outgoing Transfer',
        points: 10,
      },
      {
        name: 'Incoming Transfer',
        points: 2,
      },
      {
        name: 'Function Call',
        points: 10,
      },
      {
        name: 'Contract Deployment',
        points: 100,
      },
      {
        name: 'Account Creation',
        points: 50,
      },
    ];

    return {
      getActionScore,
      account,
      score,
      isScoreLoading,
      actions,
      isActionsLoading,
      scoringActions,
      modalOpen,
      scoreTable,
    };
  },
});
</script>
