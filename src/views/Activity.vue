<template>
  <small class="text-xl font-bold text-indigo-200">NEAR Stats</small>
  <h2 class="text-4xl font-bold">{{ account }}</h2>

  <!-- Large stats display -->
  <BigStats>
    <ProvideSingleStat
      :account="account"
      stat="gas-spent"
      #default="{ result }"
    >
      <BigStat>
        <template #name>Gas Spent</template>
        <template #value>{{ $filters.compactNumber(result) }}</template>
      </BigStat>
    </ProvideSingleStat>
    <ProvideSingleStat
      :account="account"
      stat="gas-tokens-spent"
      #default="{ result }"
    >
      <BigStat>
        <template #name>Gas Tokens Spent</template>
        <template #value
          >{{ nearSymbol }}&nbsp;{{
            $filters.compactNumber($filters.toNear(result))
          }}</template
        >
      </BigStat>
    </ProvideSingleStat>
    <ProvideSingleStat
      :account="account"
      stat="transaction-count"
      #default="{ result }"
    >
      <BigStat>
        <template #name>Transactions</template>
        <template #value>{{ $filters.compactNumber(result) }}</template>
      </BigStat>
    </ProvideSingleStat>
  </BigStats>
  <ProvideRecentTransactionActions :account="account" #default="{ results }">
    <pre
      v-for="result in results"
      :key="
        result.transaction_hash +
        result.index_in_transaction +
        result.block_timestamp
      "
      >{{ JSON.stringify(result, null, 2) }}</pre
    >
  </ProvideRecentTransactionActions>
</template>

<script lang="ts">
import { Ref } from '@vue/reactivity';
import { defineComponent, inject } from '@vue/runtime-core';
import BigStat from './BigStat.vue';
import BigStats from './BigStats.vue';
import ProvideRecentTransactionActions from './ProvideRecentTransactionActions.vue';
import ProvideSingleStat from './ProvideSingleStat.vue';

export default defineComponent({
  components: {
    BigStats,
    ProvideSingleStat,
    ProvideRecentTransactionActions,
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
