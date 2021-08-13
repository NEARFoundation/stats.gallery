<template>
  <div class="flex items-center space-x-3 p-2">
    <div
      :class="iconBgColor"
      class="w-9 h-9 flex-shrink-0 relative rounded-full text-white"
    >
      <component
        :is="icon"
        class="
          w-6
          h-6
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2 -translate-y-1/2
        "
      />
    </div>
    <div class="flex-grow flex flex-wrap items-center">
      <div class="flex-grow font-medium">
        {{ $filters.humanize.actionKind(action.action_kind) }}
        <template v-if="otherAccount !== null">
          <span class="text-gray-400">@</span>
          <a
            :href="'../' + otherAccount"
            class="
              align-bottom
              inline-block
              truncate
              max-w-xs
              text-blue-700
              underline
              hover:text-blue-500
            "
          >
            {{ otherAccount }}
          </a>
        </template>
      </div>
      <template v-if="nearValue !== null">
        <div v-if="incoming" class="font-bold text-green-500 flex items-center">
          {{
            $filters.number.standard(+$filters.toNear(nearValue))
          }}&nbsp;<near-symbol class="w-5" />
        </div>
        <div v-else class="font-bold text-red-500 flex items-center">
          &minus;{{
            $filters.number.standard(+$filters.toNear(nearValue))
          }}&nbsp;<near-symbol class="w-5" />
        </div>
      </template>
      <div
        v-if="textValue !== null"
        class="
          bg-gray-200
          truncate
          max-w-xs
          px-1
          font-mono
          rounded
          text-gray-500 text-sm
        "
      >
        {{ textValue }}
      </div>
      <div class="w-full mt-1"></div>
      <div class="flex-grow">
        <a
          :href="transactionExplorerUrl"
          target="_blank"
          rel="noreferrer"
          class="truncate text-sm text-gray-500"
        >
          {{ action.transaction_hash }}
        </a>
      </div>
      <time
        class="text-sm text-gray-500"
        :datetime="$filters.nearTimestampToISO(action.block_timestamp)"
        >{{
          $filters.nearTimestampToLocaleString(
            action.block_timestamp,
            DateTime.DATETIME_MED,
          )
        }}</time
      >
    </div>
  </div>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { networks } from '@/services/near/indexer/networks';
import {
  ActionKind,
  IAddKeyArgs,
  IDeleteKeyArgs,
  IDeployContractArgs,
  IFunctionCallArgs,
  IStakeArgs,
  ITransactionAction,
  ITransferArgs,
  UnifiedTransactionAction,
} from '@/services/near/indexer/types';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeCheckIcon,
  KeyIcon,
  LightningBoltIcon,
  LockClosedIcon,
  UserAddIcon,
  UserRemoveIcon,
} from 'heroicons-vue3/outline';
import { DateTime } from 'luxon';
import { Component, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    action: {
      type: Object as () => UnifiedTransactionAction,
      required: true,
    },
  },
  setup(props) {
    const { account, network } = useNear();

    const otherAccount = ref(null as null | string);
    const icon = ref(ArrowDownIcon as Component);
    const iconBgColor = ref('bg-green-500');
    const nearValue = ref('0' as null | string);
    const textValue = ref(null as null | string);
    const incoming = ref(false);
    const transactionExplorerUrl = ref('');

    watch(
      [props, account, network],
      ([{ action }, account, network]) => {
        transactionExplorerUrl.value =
          networks[network].explorer +
          '/transactions/' +
          action.transaction_hash;

        switch (action.action_kind) {
          case ActionKind.ADD_KEY:
            otherAccount.value = null;
            icon.value = KeyIcon;
            iconBgColor.value = 'bg-blue-400';
            incoming.value = false;
            nearValue.value = null;
            textValue.value = (
              action as ITransactionAction<IAddKeyArgs>
            ).args.public_key;
            break;
          case ActionKind.DEPLOY_CONTRACT:
            otherAccount.value = action.receiver_account_id;
            icon.value = BadgeCheckIcon;
            iconBgColor.value = 'bg-blue-700';
            incoming.value = false;
            nearValue.value = null;
            textValue.value = (
              action as ITransactionAction<IDeployContractArgs>
            ).args.code_sha256;
            break;
          case ActionKind.DELETE_KEY:
            otherAccount.value = null;
            icon.value = KeyIcon;
            iconBgColor.value = 'bg-red-500';
            incoming.value = false;
            nearValue.value = null;
            textValue.value = (
              action as ITransactionAction<IDeleteKeyArgs>
            ).args.public_key;
            break;
          case ActionKind.DELETE_ACCOUNT:
            otherAccount.value = null;
            icon.value = UserRemoveIcon;
            iconBgColor.value = 'bg-red-500';
            incoming.value = false;
            nearValue.value = null;
            textValue.value = action.receiver_account_id;
            break;
          case ActionKind.CREATE_ACCOUNT:
            otherAccount.value = null;
            icon.value = UserAddIcon;
            iconBgColor.value = 'bg-green-500';
            incoming.value = false;
            nearValue.value = null;
            textValue.value = action.receiver_account_id;
            break;
          case ActionKind.FUNCTION_CALL:
            otherAccount.value = action.receiver_account_id;
            icon.value = LightningBoltIcon;
            iconBgColor.value = 'bg-yellow-400';
            incoming.value = false;
            nearValue.value = null;
            textValue.value = (
              action as ITransactionAction<IFunctionCallArgs>
            ).args.method_name;
            break;
          case ActionKind.TRANSFER:
            if (action.receiver_account_id === account) {
              otherAccount.value = action.signer_account_id;
              icon.value = ArrowDownIcon;
              iconBgColor.value = 'bg-green-500';
              incoming.value = true;
            } else {
              otherAccount.value = action.receiver_account_id;
              icon.value = ArrowUpIcon;
              iconBgColor.value = 'bg-red-500';
              incoming.value = false;
            }
            nearValue.value = (
              action as ITransactionAction<ITransferArgs>
            ).args.deposit;
            textValue.value = null;
            break;
          case ActionKind.STAKE:
            otherAccount.value = action.receiver_account_id;
            icon.value = LockClosedIcon;
            iconBgColor.value = 'bg-purple-500';
            incoming.value = false;
            nearValue.value = (
              action as ITransactionAction<IStakeArgs>
            ).args.stake;
            textValue.value = null;
            break;
        }
      },
      { immediate: true },
    );

    return {
      transactionExplorerUrl,
      otherAccount,
      icon,
      iconBgColor,
      incoming,
      nearValue,
      textValue,
      DateTime,
    };
  },
});
</script>
