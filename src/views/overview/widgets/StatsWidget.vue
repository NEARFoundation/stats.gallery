<template>
  <DashboardCard title="Brief Stats">
    <template #help>
      A quick look at your account across time. What a journey!
    </template>
    <template #default>
      <div class="flex-grow flex items-center">
        <div
          class="
            flex-grow flex flex-col
            items-center
            sm:flex-row sm:items-start
            flex-wrap
            justify-around
          "
        >
          <BriefStat
            title="Transactions sent"
            :value="$filters.number.compact(sentCount + receivedCount)"
          >
            <div class="flex justify-between self-stretch">
              <div class="flex flex-col items-center">
                <div>
                  <ArrowSmDownIcon
                    class="inline align-text-top w-5 text-gray-400"
                  />
                  <span class="text-green-500 font-semibold">{{
                    $filters.number.compact(receivedCount)
                  }}</span>
                </div>
                <small>Incoming</small>
              </div>
              <div class="flex flex-col items-center">
                <div>
                  <ArrowSmUpIcon
                    class="inline align-text-top w-5 text-gray-400"
                  />
                  <span class="text-red-500 font-semibold">{{
                    $filters.number.compact(sentCount)
                  }}</span>
                </div>
                <small>Outgoing</small>
              </div>
            </div>
          </BriefStat>
          <BriefStat
            title="Gas burned"
            :value="$filters.number.compact(gasSpent) + 'gas'"
          >
            <div class="flex">
              <near-symbol class="w-5" />&nbsp;{{
                $filters.number.standard(
                  +$filters.toNear(gasTokensSpent).toString(),
                )
              }}
            </div>
          </BriefStat>
          <BriefStat
            title="Time with NEAR"
            :value="
              $filters.number.standard(durationDays | 0) + ' days &#128588;'
            "
          >
            <p>
              Since
              <time :datetime="$filters.nearTimestampToISO(creationDate)">{{
                $filters.nearTimestampToLocaleString(
                  creationDate,
                  DateTime.DATE_MED,
                )
              }}</time>
            </p>
          </BriefStat>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { useSingle } from '@/composables/useSingle';
import { defineComponent, ref, watch } from 'vue';
import { ArrowSmDownIcon, ArrowSmUpIcon } from 'heroicons-vue3/outline';
import BriefStat from '../BriefStat.vue';
import DashboardCard from '../DashboardCard.vue';
import { DateTime } from 'luxon';

export default defineComponent({
  components: { DashboardCard, BriefStat, ArrowSmDownIcon, ArrowSmUpIcon },
  setup() {
    const { account, network, timeframe } = useNear();
    const { value: sentCount, isLoading: isSentLoading } = useSingle(
      'sent-transaction-count',
      { account, network, timeframe },
      0,
    );
    const { value: receivedCount, isLoading: isReceivedLoading } = useSingle(
      'received-transaction-count',
      { account, network, timeframe },
      0,
    );
    const { value: creationDate, isLoading: isCreationLoading } = useSingle(
      'account-creation',
      { account, network, timeframe },
      0,
    );

    const { value: gasSpent, isLoading: isGasSpentLoading } = useSingle(
      'gas-spent',
      { account, network, timeframe },
      0,
    );
    const { value: gasTokensSpent, isLoading: isGasTokensSpentLoading } =
      useSingle('gas-tokens-spent', { account, network, timeframe }, 0);

    const durationDays = ref(0);

    watch(creationDate, creationDate => {
      durationDays.value = DateTime.fromMillis(creationDate / 1_000_000)
        .diffNow('days')
        .negate().days;
    });

    return {
      sentCount,
      receivedCount,
      creationDate,
      DateTime,
      durationDays,
      gasSpent,
      gasTokensSpent,
    };
  },
});
</script>
