<template>
  <DashboardCard title="Level">
    <template #help>
      Complete quests and earn points to increase your level. Try to reach the
      max!
    </template>
    <template #default>
      <div
        class="
          flex flex-col
          items-center
          justify-center
          flex-grow
          p-3
          space-y-2
        "
      >
        <div class="flex space-x-2 items-center">
          <Star class="text-blue-500">{{ accountLevel.level }}</Star>
          <div class="font-bold text-2xl">
            {{ $filters.humanize.level(accountLevel.level) }}
          </div>
        </div>
        <div class="flex w-full items-center space-x-2">
          <span class="text-gray-500 text-lg">{{
            $filters.number.standard(accountLevel.creditToNextLevel)
          }}</span>
          <div
            class="
              flex-grow
              bg-gray-200
              h-2
              rounded-full
              relative
              flex
              overflow-hidden
            "
          >
            <div
              class="bg-purple-500 rounded-full"
              :style="`width: ${
                (accountLevel.creditToNextLevel /
                  accountLevel.requiredToNextLevel) *
                100
              }%`"
            ></div>
          </div>
          <span class="text-gray-500 text-lg">{{
            $filters.number.standard(accountLevel.requiredToNextLevel)
          }}</span>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { useScore } from '@/composables/useScore';
import { defineComponent } from 'vue';
import DashboardCard from '../DashboardCard.vue';
import Star from '../Star.vue';

export default defineComponent({
  components: { DashboardCard, Star },
  setup() {
    const { account, network, timeframe } = useNear();
    const { accountLevel, isLoading: isScoreLoading } = useScore({
      account,
      network,
      timeframe,
    });

    return {
      accountLevel,
    };
  },
});
</script>
