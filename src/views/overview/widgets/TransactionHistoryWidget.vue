<template>
  <DashboardCard title="Transaction History" embed="embed:transaction-history">
    <template #help>
      Visualize transaction activity on two axes: accounts and time.
    </template>
    <template #default>
      <div class="flex-grow flex p-3">
        <div class="flex flex-col items-end pt-2">
          <div
            class="font-bold h-12 truncate text-green-400"
            style="max-width: 12rem"
          >
            {{ currentAccount }}
          </div>
          <div
            class="font-medium h-12 truncate"
            style="max-width: 12rem"
            v-for="account of mostInteractedAccounts"
            :key="account"
          >
            {{ account }}
          </div>
        </div>
        <div class="ml-3 pt-5 flex-1 overflow-x-auto flex scrollbar">
          <div
            v-if="mostInteractedActions.length === 0"
            class="-mt-3 flex-1 text-center text-gray-500 italic"
          >
            Nothing to show.
          </div>
          <div
            v-for="(action, i) of mostInteractedActions"
            :key="action"
            class="relative w-12 flex-shrink-0"
          >
            <template
              v-if="
                action.receiver_account_id !== action.predecessor_account_id
              "
            >
              <!-- Line -->
              <div
                class="
                  absolute
                  left-1/2
                  transform
                  -translate-x-1/2
                  w-0.5
                  bg-gray-500
                  dark:bg-gray-300
                  z-10
                "
                :style="{
                  top:
                    (Math.min(
                      mostInteractedAccounts.indexOf(
                        action.predecessor_account_id,
                      ),
                      mostInteractedAccounts.indexOf(
                        action.receiver_account_id,
                      ),
                    ) +
                      1) *
                      3 +
                    'rem',
                  height:
                    (Math.max(
                      mostInteractedAccounts.indexOf(
                        action.predecessor_account_id,
                      ),
                      mostInteractedAccounts.indexOf(
                        action.receiver_account_id,
                      ),
                    ) +
                      1) *
                      3 +
                    'rem',
                }"
              ></div>
              <!-- Point -->
              <div
                class="
                  absolute
                  w-3
                  h-3
                  rounded-full
                  transform
                  -translate-y-1/2 -translate-x-1/2
                  left-1/2
                  bg-green-400
                  border-2 border-white
                  dark:border-gray-800
                  z-20
                "
                :style="{
                  top:
                    (mostInteractedAccounts.indexOf(
                      action.predecessor_account_id,
                    ) +
                      1) *
                      3 +
                    'rem',
                }"
              ></div>
            </template>
            <!-- Icon -->
            <Tooltip
              class="
                absolute
                w-8
                h-8
                left-1/2
                transform
                -translate-x-1/2 -translate-y-1/2
                z-30
              "
              :style="{
                top:
                  (mostInteractedAccounts.indexOf(action.receiver_account_id) +
                    1) *
                    3 +
                  'rem',
              }"
            >
              <template v-slot:trigger="{ open }">
                <ActionIcon
                  class="
                    w-8
                    h-8
                    border-2 border-white
                    dark:border-gray-800
                    transform
                    transition-all
                    duration-75
                  "
                  :class="{
                    'scale-125 filter drop-shadow-sm': open,
                  }"
                  :action="action"
                  transactionStyle="generic"
                />
              </template>
              <template #content>
                <h6 class="text-center font-medium">
                  {{ $filters.humanize.actionKind(action.action_kind) }}
                </h6>
                <table class="text-sm">
                  <tbody>
                    <tr>
                      <th>From:</th>
                      <td>
                        <account-link
                          theme="dark"
                          :account="action.predecessor_account_id"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>To:</th>
                      <td>
                        <account-link
                          theme="dark"
                          :account="action.receiver_account_id"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Hash:</th>
                      <td>{{ action.transaction_hash }}</td>
                    </tr>
                    <tr>
                      <th>Date:</th>
                      <td>
                        {{
                          $filters.nearTimestampToLocaleString(
                            action.block_timestamp,
                            DateTime.DATETIME_FULL,
                          )
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p class="text-center mt-2 text-gray-400">
                  <external-link
                    :href="
                      networks[network].explorer +
                      '/transactions/' +
                      action.transaction_hash
                    "
                    class="underline"
                    >Transaction Details</external-link
                  >
                </p>
              </template>
            </Tooltip>
            <!-- Current account track -->
            <div
              class="
                relative
                h-12
                z-10
                border-t-2 border-green-400
                dark:border-green-600
              "
            >
              <!-- Vertical grid line -->
              <div
                v-if="i !== mostInteractedActions.length - 1"
                class="
                  absolute
                  h-full
                  right-0
                  border-r border-gray-200
                  dark:border-gray-700
                "
              ></div>
            </div>
            <!-- Other account tracks -->
            <div
              v-for="(account, j) of mostInteractedAccounts"
              :key="account"
              class="
                relative
                flex
                justify-center
                h-12
                border-t-2 border-gray-200
                dark:border-gray-700
              "
            >
              <!-- Vertical grid line -->
              <div
                v-if="
                  i !== mostInteractedActions.length - 1 &&
                  j !== mostInteractedAccounts.length - 1
                "
                class="
                  absolute
                  h-full
                  right-0
                  border-r border-gray-200
                  dark:border-gray-700
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<style scoped>
.scrollbar {
  scrollbar-color: dark;
  scrollbar-width: thin;
}

.scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  background-color: transparent;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.4);
  border-radius: 9999px;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(128, 128, 128, 0.6);
}

th {
  @apply text-gray-400 font-normal text-right pr-2;
}

td {
  @apply truncate;
  max-width: 20em;
}
</style>

<script lang="ts">
import ActionIcon from '@/components/ActionIcon.vue';
import Tooltip from '@/components/Tooltip.vue';
import { useNear } from '@/composables/useNear';
import { useTransactionActions } from '@/composables/useTransactionActions';
import { networks } from '@/services/near/indexer/networks';
import { UnifiedTransactionAction } from '@/services/near/indexer/types';
import { DateTime } from 'luxon';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';

export default defineComponent({
  components: {
    ActionIcon,
    DashboardCard,
    Tooltip,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useTransactionActions({ account, network, timeframe });
    const mostInteractedAccounts = ref<string[]>([]);
    const mostInteractedActions = ref<UnifiedTransactionAction[]>([]);

    watch(actions, actions => {
      const byQuantity = actions.reduce((map, item) => {
        map.set(
          item.signer_account_id,
          (map.get(item.signer_account_id) ?? 0) + 1,
        );
        map.set(
          item.receiver_account_id,
          (map.get(item.receiver_account_id) ?? 0) + 1,
        );
        return map;
      }, new Map<string, number>());

      // Remove current account
      byQuantity.delete(account.value);

      const sorted = Array.from(byQuantity.keys()).sort(
        (a, b) => byQuantity.get(b)! - byQuantity.get(a)!,
      );

      const top = sorted.slice(0, 3);

      const filteredActions = actions.filter(
        action =>
          (action.receiver_account_id === account.value &&
            action.signer_account_id === account.value) ||
          top.includes(action.receiver_account_id) ||
          top.includes(action.signer_account_id),
      );

      mostInteractedAccounts.value = top;
      mostInteractedActions.value = filteredActions;
    });

    return {
      currentAccount: account,
      actions,
      mostInteractedAccounts,
      mostInteractedActions,
      DateTime,
      network,
      networks,
    };
  },
});
</script>
