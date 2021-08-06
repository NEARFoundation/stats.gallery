<template>
  <small class="text-xl font-bold text-indigo-200">NEAR Stats</small>
  <h2 class="text-4xl font-bold">{{ account }}</h2>

  <!-- Large stats display -->
  <BigStats>
    <SingleStatProvider
      stat="gas-spent"
      :account="account"
      :network="network"
      :timeframe="timeframe"
      #default="{ value, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Gas Spent</template>
        <template #value>
          {{ $filters.number.compact(value) }}
        </template>
      </BigStat>
    </SingleStatProvider>
    <SingleStatProvider
      stat="gas-tokens-spent"
      :account="account"
      :network="network"
      :timeframe="timeframe"
      #default="{ value, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>NEAR Spent on Gas</template>
        <template #value>
          {{ nearSymbol }}&nbsp;{{
            $filters.number.compact($filters.toNear(value))
          }}
        </template>
      </BigStat>
    </SingleStatProvider>
    <SingleStatProvider
      stat="sent-transaction-count"
      :account="account"
      :network="network"
      :timeframe="timeframe"
      #default="{ value, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Transactions</template>
        <template #value>
          {{ $filters.number.compact(value) }}
        </template>
      </BigStat>
    </SingleStatProvider>
  </BigStats>
  <ActionsProvider
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
  </ActionsProvider>
</template>

<script lang="ts">
import TransactionActions from '@/components/activity/TransactionActions.vue';
import BigStat from '@/components/stats/BigStat.vue';
import BigStats from '@/components/stats/BigStats.vue';
import { useNear } from '@/composables/useNear';
import ActionsProvider from '@/providers/ActionsProvider.vue';
import SingleStatProvider from '@/providers/SingleStatProvider.vue';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  components: {
    BigStats,
    SingleStatProvider,
    ActionsProvider,
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
