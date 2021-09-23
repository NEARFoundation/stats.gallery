<template>
  <div
    :class="iconBgColor"
    class="flex-shrink-0 relative rounded-full text-white"
  >
    <component
      :is="icon"
      class="
        w-2/3
        h-2/3
        absolute
        top-1/2
        left-1/2
        transform
        -translate-x-1/2 -translate-y-1/2
      "
    />
  </div>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import {
  ActionKind,
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
import { Component, defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
  props: {
    action: {
      type: Object as PropType<UnifiedTransactionAction>,
      required: true,
    },
  },
  setup(props) {
    const { account, network } = useNear();

    const icon = ref(ArrowDownIcon as Component);
    const iconBgColor = ref('bg-green-500');

    watch(
      [props, account, network],
      ([{ action }, account, network]) => {
        switch (action.action_kind) {
          case ActionKind.ADD_KEY:
            icon.value = KeyIcon;
            iconBgColor.value = 'bg-blue-400';
            break;
          case ActionKind.DEPLOY_CONTRACT:
            icon.value = BadgeCheckIcon;
            iconBgColor.value = 'bg-blue-700';
            break;
          case ActionKind.DELETE_KEY:
            icon.value = KeyIcon;
            iconBgColor.value = 'bg-red-500';
            break;
          case ActionKind.DELETE_ACCOUNT:
            icon.value = UserRemoveIcon;
            iconBgColor.value = 'bg-red-500';
            break;
          case ActionKind.CREATE_ACCOUNT:
            icon.value = UserAddIcon;
            iconBgColor.value = 'bg-green-500';
            break;
          case ActionKind.FUNCTION_CALL:
            icon.value = LightningBoltIcon;
            iconBgColor.value = 'bg-yellow-400';
            break;
          case ActionKind.TRANSFER:
            if (action.receiver_account_id === account) {
              icon.value = ArrowDownIcon;
              iconBgColor.value = 'bg-green-500';
            } else {
              icon.value = ArrowUpIcon;
              iconBgColor.value = 'bg-red-500';
            }
            break;
          case ActionKind.STAKE:
            icon.value = LockClosedIcon;
            iconBgColor.value = 'bg-purple-500';
            break;
        }
      },
      { immediate: true },
    );

    return {
      icon,
      iconBgColor,
    };
  },
});
</script>
