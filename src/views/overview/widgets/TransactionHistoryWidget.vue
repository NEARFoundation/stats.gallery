<template>
  <DashboardCard title="Transaction History" embed="embed:transaction-history">
    <template #help>
      Visualize transaction activity on two axes: accounts and time.
    </template>
    <template #default>
      <div class="flex-grow flex p-3">
        <div class="flex flex-col items-end pt-2">
          <div
            class="font-bold h-12 truncate text-purple-300"
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
        <div
          class="ml-3 pt-5 flex-1 overflow-x-auto flex scrollbar"
          ref="scrollableContainerRef"
        >
          <div
            v-for="action of mostInteractedActions"
            :key="action"
            class="relative w-12 flex-shrink-0"
          >
            <template
              v-if="action.receiver_account_id !== action.signer_account_id"
            >
              <div
                class="
                  absolute
                  left-1/2
                  transform
                  -translate-x-1/2
                  w-0.5
                  bg-gray-300
                  z-10
                "
                :style="{
                  top:
                    (Math.min(
                      mostInteractedAccounts.indexOf(action.signer_account_id),
                      mostInteractedAccounts.indexOf(
                        action.receiver_account_id,
                      ),
                    ) +
                      1) *
                      3 +
                    'rem',
                  height:
                    (Math.max(
                      mostInteractedAccounts.indexOf(action.signer_account_id),
                      mostInteractedAccounts.indexOf(
                        action.receiver_account_id,
                      ),
                    ) +
                      1) *
                      3 +
                    'rem',
                }"
              ></div>
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
                  border-2 border-gray-800
                  z-20
                "
                :style="{
                  top:
                    (mostInteractedAccounts.indexOf(
                      action.receiver_account_id,
                    ) +
                      1) *
                      3 +
                    'rem',
                }"
              ></div>
            </template>
            <div
              class="
                absolute
                w-7
                h-7
                left-1/2
                transform
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                z-40
                border-2 border-gray-800
              "
              :style="{
                top:
                  (mostInteractedAccounts.indexOf(action.signer_account_id) +
                    1) *
                    3 +
                  'rem',
              }"
            >
              <ActionIcon class="w-7 h-7" :action="action" />
            </div>
            <div class="relative h-12 z-10 border-t-2 border-green-600">
              <div
                class="absolute h-full right-0 border-r border-gray-700"
              ></div>
            </div>
            <div
              v-for="account of mostInteractedAccounts"
              :key="account"
              class="
                relative
                flex
                justify-center
                h-12
                border-t-2 border-gray-700
              "
            >
              <div
                class="absolute h-full right-0 border-r border-gray-700"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<style scoped>
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
</style>

<script lang="ts">
import ActionIcon from '@/components/ActionIcon.vue';
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { UnifiedTransactionAction } from '@/services/near/indexer/types';
import { defineComponent, onMounted, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';

export default defineComponent({
  components: {
    ActionIcon,
    DashboardCard,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });
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

    const scrollableContainerRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      const el = scrollableContainerRef.value;
      if (el !== null) {
        el.scrollLeft = el.scrollWidth;
      }
    });

    return {
      currentAccount: account,
      scrollableContainerRef,
      actions,
      mostInteractedAccounts,
      mostInteractedActions,
    };
  },
});
</script>