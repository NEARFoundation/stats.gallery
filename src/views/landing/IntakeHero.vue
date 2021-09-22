<template>
  <div
    class="py-16 lg:py-64 flex flex-col items-center relative overflow-hidden"
  >
    <Chart :option="chartOption" class="bg-chart" autoresize />
    <h1 class="font-bold text-white text-4xl lg:text-6xl mb-5 mx-4 text-center">
      Investigate
      <span class="text-green-400 uppercase">your NEAR</span> account
    </h1>
    <p class="text-2xl text-white lg:text-4xl mb-8">
      and {{ $filters.number.standard(allAccounts) }} other accounts
    </p>
    <div
      class="
        flex flex-col
        lg:flex-row
        flex-shrink-0
        lg:space-x-4
        items-stretch
        lg:items-start
      "
    >
      <div class="flex flex-col flex-shrink-0">
        <AccountInput
          autofocus
          class="shadow-md"
          v-model="accountInputValue"
          @submit="go"
        />
        <small class="text-sm text-gray-400 text-center font-medium m-3">
          Enter account name
        </small>
      </div>
      <div class="flex flex-col flex-shrink-0">
        <TimeframeInput
          class="shadow-md lg:w-48"
          v-model="timeframeInputValue"
        />
        <small class="text-sm text-gray-400 text-center font-medium m-3">
          Select range
        </small>
      </div>
      <div class="flex flex-col flex-shrink-0">
        <NetworkInput class="shadow-md lg:w-48" v-model="networkInputValue" />
        <small class="text-sm text-gray-400 text-center font-medium m-3">
          Select network
        </small>
      </div>
      <PrimaryButton @click="go">Show stats</PrimaryButton>
    </div>
    <div class="flex space-x-3 mt-6" v-if="accountsJumble.length">
      <span class="text-white font-medium">Or try these:</span>
      <account-link
        v-for="account of accountsJumble.slice(0, 4)"
        :key="account"
        :account="account"
        class="truncate"
        style="max-width: 150px"
      />
    </div>
  </div>
</template>

<style scoped>
.bg-chart {
  @apply bg-gray-700;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
}
</style>

<script lang="ts">
import AccountInput from '@/components/form/AccountInput.vue';
import NetworkInput from '@/components/form/NetworkInput.vue';
import PrimaryButton from '@/components/form/PrimaryButton.vue';
import TimeframeInput from '@/components/form/TimeframeInput.vue';
import { useNetworkActivityChart } from '@/composables/charts/useNetworkActivityChart';
import { useMultiple } from '@/composables/useMultiple';
import { useSingle } from '@/composables/useSingle';
import { Network } from '@/services/near/indexer/networks';
import { Timeframe } from '@/services/timeframe';
import { defineComponent, ref, watch } from 'vue';
import Chart from '@/components/Chart.vue';
import { useRouter } from 'vue-router';
import { CachedAccountRecord } from '@/services/near/indexer/types';

export default defineComponent({
  components: {
    AccountInput,
    TimeframeInput,
    NetworkInput,
    PrimaryButton,
    Chart,
  },
  name: 'intake-hero',
  setup() {
    const accountInputValue = ref('');
    const timeframeInputValue = ref<Timeframe>(Timeframe.WEEK);
    const networkInputValue = ref<Network>(Network.MAINNET);

    const { value: allAccounts } = useSingle(
      'all-accounts',
      {
        account: '',
        network: networkInputValue,
        timeframe: Timeframe.ALL,
      },
      314071,
    );

    type NewAccountsByDateEntry = {
      new_accounts: number;
      block_date: string;
    };
    const { value: newAccountsByDate } = useMultiple<NewAccountsByDateEntry>(
      'new-accounts-count',
      { network: networkInputValue },
    );
    const chartOption = useNetworkActivityChart(newAccountsByDate);

    type NewAccountEntry = {
      account_id: string;
      block_timestamp: number;
    };

    const { value: newAccounts } = useMultiple<NewAccountEntry>(
      'new-accounts-list',
      {
        network: networkInputValue,
      },
    );

    const { value: balanceLeaderboard } = useMultiple<CachedAccountRecord>(
      'leaderboard-balance',
      {
        account: '',
        network: Network.MAINNET,
        timeframe: Timeframe.ALL,
      },
      [],
    );

    const { value: scoreLeaderboard } = useMultiple<CachedAccountRecord>(
      'leaderboard-score',
      {
        account: '',
        network: Network.MAINNET,
        timeframe: Timeframe.ALL,
      },
      [],
    );

    const accountsJumble = ref<string[]>([]);

    watch(
      [newAccounts, scoreLeaderboard, balanceLeaderboard],
      ([newAccounts, scoreLeaderboard, balanceLeaderboard]) => {
        const a = [];
        for (let i = 0; i < 10; i++) {
          const randomArray = [
            newAccounts,
            scoreLeaderboard,
            balanceLeaderboard,
          ][Math.floor(Math.random() * 3)];
          if (randomArray.length) {
            const randomSelection =
              randomArray[Math.floor(Math.random() * randomArray.length)]
                .account_id;
            a.push(randomSelection);
          }
        }

        accountsJumble.value = Array.from(new Set(a));
      },
    );

    const router = useRouter();

    const go = () => {
      router.push({
        name: 'overview',
        params: {
          network: networkInputValue.value,
          account: accountInputValue.value,
        },
        query: {
          t: timeframeInputValue.value,
        },
      });
    };

    return {
      accountInputValue,
      timeframeInputValue,
      networkInputValue,
      chartOption,
      go,
      allAccounts,
      accountsJumble,
    };
  },
});
</script>
