<template>
  <small class="text-xl font-bold text-indigo-200">NEAR Stats</small>
  <h2 class="text-4xl font-bold">{{ account }}</h2>

  <!-- Large stats display -->
  <BigStats>
    <ProvideStat
      :account="account"
      :since="0"
      stat="gas-spent"
      #default="{ value }"
    >
      <BigStat>
        <template #name>Gas Spent</template>
        <template #value>{{ $filters.compactNumber(value) }}</template>
      </BigStat>
    </ProvideStat>
    <ProvideStat
      :account="account"
      :since="0"
      stat="gas-tokens-spent"
      #default="{ value }"
    >
      <BigStat>
        <template #name>Gas Tokens Spent</template>
        <template #value
          >{{ nearSymbol }}&nbsp;{{
            $filters.compactNumber($filters.toNear(value))
          }}</template
        >
      </BigStat>
    </ProvideStat>
    <ProvideStat
      :account="account"
      :since="0"
      stat="transaction-count"
      #default="{ value }"
    >
      <BigStat>
        <template #name>Transactions</template>
        <template #value>{{ $filters.compactNumber(value) }}</template>
      </BigStat>
    </ProvideStat>
  </BigStats>
</template>

<script lang="ts">
import { Ref } from '@vue/reactivity';
import { defineComponent, inject } from '@vue/runtime-core';
import BigStat from './BigStat.vue';
import BigStats from './BigStats.vue';
import ProvideStat from './ProvideStat.vue';

export default defineComponent({
  components: {
    BigStats,
    ProvideStat,
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
