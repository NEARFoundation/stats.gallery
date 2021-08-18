<template>
  <DashboardCard title="Balance">
    <template #help>
      Monitor your current balance of NEAR and review recent transactions.
    </template>
    <template #action>
      <a
        href="https://wallet.near.org/"
        target="_blank"
        rel="noreferrer"
        class="
          text-sm
          font-medium
          underline
          text-purple-700
          hover:text-purple-500
          inline-flex
          items-center
          whitespace-nowrap
        "
      >
        <span>Open wallet</span>
        <external-link-icon class="ml-1 text-gray-400" />
      </a>
    </template>
    <template #default>
      <HeaderListButtonTemplate
        listTitle="Recent transfers"
        buttonText="View transfers"
        :empty="transfers.length === 0"
        @expand="expandModalOpen = true"
      >
        <template #header>
          <div class="text-2xl font-bold flex py-1">
            <near-symbol class="w-8 h-8" />&nbsp;{{
              $filters.number.standard(+$filters.toNear(view.amount).toString())
            }}
          </div>
        </template>
        <template #default>
          <template v-for="(transfer, i) in transfers.slice(0, 4)" :key="i">
            <div class="truncate">
              <account-link :account="transfer.account" />
            </div>
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
      <Modal
        :open="expandModalOpen"
        title="Transfers"
        @close="expandModalOpen = false"
      >
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transfer, i) in transfers" :key="i">
              <td class="truncate" style="max-width: 200px">
                {{ transfer.action.signer_account_id }}
              </td>
              <td class="truncate" style="max-width: 200px">
                {{ transfer.action.receiver_account_id }}
              </td>
              <td v-if="transfer.incoming" class="text-green-500 font-bold">
                +{{
                  $filters.number.standard(
                    +$filters.toNear(transfer.amount).toString(),
                  )
                }}
              </td>
              <td v-else class="text-red-500 font-bold">
                &minus;{{
                  $filters.number.standard(
                    +$filters.toNear(transfer.amount).toString(),
                  )
                }}
              </td>
              <td class="italic">
                <a
                  :href="
                    networks[network].explorer +
                    '/transactions/' +
                    transfer.action.transaction_hash
                  "
                  target="_blank"
                  rel="noreferrer"
                >
                  <time
                    :datetime="
                      $filters.nearTimestampToISO(
                        transfer.action.block_timestamp,
                      )
                    "
                  >
                    {{
                      $filters.nearTimestampToLocaleString(
                        transfer.action.block_timestamp,
                        DateTime.DATETIME_MED,
                      )
                    }}
                  </time>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import Modal from '@/components/Modal.vue';
import { useAccountView } from '@/composables/useAccountView';
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { networks } from '@/services/near/indexer/networks';
import {
  ActionKind,
  ITransferArgs,
  UnifiedTransactionAction,
} from '@/services/near/indexer/types';
import { DateTime } from 'luxon';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';
import HeaderListButtonTemplate from './HeaderListButtonTemplate.vue';

export default defineComponent({
  components: { DashboardCard, HeaderListButtonTemplate, Modal },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });
    const { view } = useAccountView({ account, network, finality: 'final' });
    const transfers = ref(
      [] as {
        account: string;
        amount: string;
        incoming: boolean;
        action: UnifiedTransactionAction;
      }[],
    );

    watch([actions, account], ([actions, account]) => {
      const transferActions = actions.filter(
        action => action.action_kind === ActionKind.TRANSFER,
      );
      transfers.value = transferActions.map(action => {
        const incoming = action.receiver_account_id === account;
        return {
          incoming,
          account: incoming
            ? action.signer_account_id
            : action.receiver_account_id,
          amount: (action.args as ITransferArgs).deposit,
          action,
        };
      });
    });

    const expandModalOpen = ref(false);

    return {
      transfers,
      view,
      expandModalOpen,
      network,
      networks,
      DateTime,
    };
  },
});
</script>
