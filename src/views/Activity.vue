<template>
  <small class="text-xl font-bold text-indigo-200">NEAR Stats</small>
  <h2 class="text-4xl font-bold">{{ account }}</h2>

  <!-- Large stats display -->
  <BigStats>
    <SingleStatProvider
      :account="account"
      stat="gas-spent"
      #default="{ value, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Gas Spent</template>
        <template #value>
          {{ $filters.compactNumber(value) }}
        </template>
      </BigStat>
    </SingleStatProvider>
    <SingleStatProvider
      :account="account"
      stat="gas-tokens-spent"
      #default="{ value, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Gas Tokens Spent</template>
        <template #value>
          {{ nearSymbol }}&nbsp;{{
            $filters.compactNumber($filters.toNear(value))
          }}
        </template>
      </BigStat>
    </SingleStatProvider>
    <SingleStatProvider
      :account="account"
      stat="transaction-count"
      #default="{ value, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Transactions</template>
        <template #value>
          {{ $filters.compactNumber(value) }}
        </template>
      </BigStat>
    </SingleStatProvider>
  </BigStats>
  <RecentActionsProvider
    :account="account"
    :network="network"
    :timeframe="timeframe"
    #default="{ actions, isLoading }"
  >
    <TransactionActions
      class="my-8"
      :actions="actions"
      :isLoading="isLoading"
    />
  </RecentActionsProvider>
</template>

<script lang="ts">
import TransactionActions from '@/components/activity/TransactionActions.vue';
import BigStat from '@/components/stats/BigStat.vue';
import BigStats from '@/components/stats/BigStats.vue';
import RecentActionsProvider from '@/providers/RecentActionsProvider.vue';
import SingleStatProvider from '@/providers/SingleStatProvider.vue';
import { useNear } from '@/services/useNear';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  components: {
    BigStats,
    SingleStatProvider,
    RecentActionsProvider,
    TransactionActions,
    BigStat,
  },
  setup() {
    const { account, network, timeframe } = useNear();

    return {
      account,
      network,
      timeframe,
    };
  },
});
</script>
