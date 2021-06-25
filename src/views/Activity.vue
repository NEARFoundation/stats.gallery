<template>
  <small class="text-xl font-bold text-indigo-200">NEAR Stats</small>
  <h2 class="text-4xl font-bold">{{ account }}</h2>

  <!-- Large stats display -->
  <BigStats>
    <ProvideSingleStat
      :account="account"
      stat="gas-spent"
      #default="{ result, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Gas Spent</template>
        <template #value>
          {{ $filters.compactNumber(result) }}
        </template>
      </BigStat>
    </ProvideSingleStat>
    <ProvideSingleStat
      :account="account"
      stat="gas-tokens-spent"
      #default="{ result, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Gas Tokens Spent</template>
        <template #value>
          {{ nearSymbol }}&nbsp;{{
            $filters.compactNumber($filters.toNear(result))
          }}
        </template>
      </BigStat>
    </ProvideSingleStat>
    <ProvideSingleStat
      :account="account"
      stat="transaction-count"
      #default="{ result, isLoading }"
    >
      <BigStat :isLoading="isLoading">
        <template #name>Transactions</template>
        <template #value>
          {{ $filters.compactNumber(result) }}
        </template>
      </BigStat>
    </ProvideSingleStat>
  </BigStats>
  <ProvideRecentTransactionActions
    :account="account"
    #default="{ results, isLoading }"
  >
    <TransactionActions
      class="my-8"
      :transactions="results"
      :isLoading="isLoading"
    />
  </ProvideRecentTransactionActions>
</template>

<script lang="ts">
import TransactionActions from '@/components/activity/TransactionActions.vue';
import BigStat from '@/components/stats/BigStat.vue';
import BigStats from '@/components/stats/BigStats.vue';
import ProvideRecentTransactionActions from '@/providers/ProvideRecentTransactionActions.vue';
import ProvideSingleStat from '@/providers/ProvideSingleStat.vue';
import { Ref } from '@vue/reactivity';
import { defineComponent, inject } from '@vue/runtime-core';

export default defineComponent({
  components: {
    BigStats,
    ProvideSingleStat,
    ProvideRecentTransactionActions,
    TransactionActions,
    BigStat,
  },
  setup() {
    const account = inject<Ref<string>>('account')!;

    return {
      account,
    };
  },
});
</script>
