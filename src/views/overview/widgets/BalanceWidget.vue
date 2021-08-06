<template>
  <DashboardCard title="Balance">
    <template #help>
      Monitor your current balance of NEAR and review recent transactions.
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
        <div class="h-20 flex flex-col justify-center items-center">
          <div class="text-2xl font-bold flex py-1">
            <near-symbol class="w-8 h-8" />&nbsp;{{
              $filters.number.standard(+$filters.toNear(view.amount).toString())
            }}
          </div>
          <!-- <div class="text-green-500 font-semibold flex py-1 items-center">
            +23.256
          </div> -->
        </div>
        <div class="w-full flex-grow flex flex-col space-y-4 items-center">
          <h4 class="w-full font-medium">Recent transfers</h4>
          <div class="w-full flex-grow flex flex-col space-y-2">
            <div
              v-for="(transfer, i) in transfers"
              :key="i"
              class="flex space-x-2"
            >
              <div class="flex-1 truncate">@{{ transfer.account }}</div>
              <div v-if="transfer.incoming" class="text-green-500 font-bold">
                +{{
                  $filters.number.standard(
                    +$filters.toNear(transfer.amount).toString(),
                  )
                }}
              </div>
              <div v-else class="text-red-500 font-bold">
                &minus;{{
                  $filters.number.standard(
                    +$filters.toNear(transfer.amount).toString(),
                  )
                }}
              </div>
            </div>
          </div>
          <button
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
            View transfers
          </button>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { ActionKind, ITransferArgs } from '@/services/near/indexer/types';
import { defineComponent, ref, watch } from 'vue';
import { useAccountView } from '@/composables/useAccountView';
import DashboardCard from '../DashboardCard.vue';

export default defineComponent({
  components: { DashboardCard },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });
    const { view } = useAccountView({ account, network, finality: 'final' });
    const transfers = ref(
      [] as { account: string; amount: string; incoming: boolean }[],
    );

    watch([actions, account], ([actions, account]) => {
      const transferActions = actions.filter(
        action => action.action_kind === ActionKind.TRANSFER,
      );
      transfers.value = transferActions
        .map(action => {
          const incoming = action.receiver_account_id === account;
          return {
            incoming,
            account: incoming
              ? action.signer_account_id
              : action.receiver_account_id,
            amount: (action.args as ITransferArgs).deposit,
          };
        })
        .slice(0, 4);
    });

    return { transfers, view };
  },
});
</script>
