<template>
  <DashboardCard title="Score">
    <template #help>
      Track your activity across the network with a unified score. The more you
      participate, the higher your score grows!
    </template>
    <template #default>
      <div
        class="
          flex flex-col
          items-center
          p-3
          space-y-4
          justify-between
          flex-grow
        "
      >
        <div class="h-20 flex justify-center items-center">
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
            {{ score }}
          </div>
        </div>
        <div class="w-full flex-grow flex flex-col space-y-4 items-center">
          <h4 class="w-full font-medium">Recent earnings</h4>
          <div class="w-full flex-grow flex flex-col space-y-2">
            <div v-for="(action, i) in scoringActions" :key="i" class="flex">
              <div class="flex-grow truncate">
                {{ $filters.humanizeActionKind(action.actionKind) }}
              </div>
              <div class="text-green-500 font-bold">+{{ action.score }}</div>
            </div>
            <div
              v-if="scoringActions.length === 0"
              class="text-center text-gray-500 italic"
            >
              No activity
            </div>
          </div>
          <button
            v-if="scoringActions.length > 0"
            class="
              mt-5
              cursor-pointer
              bg-gray-200
              hover:bg-gray-300
              px-2
              rounded-sm
              truncate
            "
          >
            View scores
          </button>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { useStat } from '@/composables/useStat';
import { ActionKind } from '@/services/near/indexer/types';
import { getActionScore } from '@/utils/score';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';

export default defineComponent({
  components: { DashboardCard },
  setup() {
    const { account, network, timeframe } = useNear();
    const { value: score, isLoading: isScoreLoading } = useStat('score', 0, {
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
