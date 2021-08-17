<template>
  <DashboardCard title="Balance">
    <template #help>
      Monitor your current balance of NEAR and review recent transactions.
    </template>
    <template #default>
      <HeaderListButtonTemplate
        listTitle="Recent transfers"
        buttonText="View transfers"
        :empty="transfers.length === 0"
      >
        <template #header>
          <div class="text-2xl font-bold flex py-1">
            <near-symbol class="w-8 h-8" />&nbsp;{{
              $filters.number.standard(+$filters.toNear(view.amount).toString())
            }}
          </div>
        </template>
        <template #default>
          <template v-for="(transfer, i) in transfers" :key="i">
            <span class="truncate">@{{ transfer.account }}</span>
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
          </template>
        </template>
      </HeaderListButtonTemplate>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useAccountView } from '@/composables/useAccountView';
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { ActionKind, ITransferArgs } from '@/services/near/indexer/types';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';
import HeaderListButtonTemplate from './HeaderListButtonTemplate.vue';

export default defineComponent({
  components: { DashboardCard, HeaderListButtonTemplate },
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
