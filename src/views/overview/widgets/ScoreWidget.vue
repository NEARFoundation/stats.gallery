<template>
  <DashboardCard title="Score">
    <template #help>
      Track your activity across the network with a unified score. The more you
      participate, the higher your score grows!
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
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { useScore } from '@/composables/useScore';
import { ActionKind } from '@/services/near/indexer/types';
import { getActionScore } from '@/utils/score';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';
import HeaderListButtonTemplate from './HeaderListButtonTemplate.vue';

export default defineComponent({
  components: { DashboardCard, HeaderListButtonTemplate },
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

    return {
      getActionScore,
      account,
      score,
      isScoreLoading,
      actions,
      isActionsLoading,
      scoringActions,
    };
  },
});
</script>
