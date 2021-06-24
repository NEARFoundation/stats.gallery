<template>
  <slot :component="component" :color="color" />
</template>

<script lang="ts">
import { ActionKind } from '@/services/near/types';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeCheckIcon,
  BanIcon,
  CubeTransparentIcon,
  KeyIcon,
  LightningBoltIcon,
  LockClosedIcon,
  UserAddIcon,
  UserRemoveIcon,
} from 'heroicons-vue3/outline';
import { defineComponent, ref, watchEffect } from 'vue';

export default defineComponent({
  props: {
    actionKind: {
      type: String as () => ActionKind,
      required: true,
    },
    direction: {
      type: String as () => 'sender' | 'receiver',
      required: false,
    },
  },
  setup(props) {
    const component = ref(CubeTransparentIcon);
    const color = ref('bg-gray-500');

    watchEffect(() => {
      switch (props.actionKind) {
        case ActionKind.ADD_KEY:
          component.value = KeyIcon;
          color.value = 'bg-green-500';
          break;
        case ActionKind.DELETE_KEY:
          component.value = BanIcon;
          color.value = 'bg-red-600';
          break;
        case ActionKind.DEPLOY_CONTRACT:
          component.value = BadgeCheckIcon;
          color.value = 'bg-blue-700';
          break;
        case ActionKind.CREATE_ACCOUNT:
          component.value = UserAddIcon;
          color.value = 'bg-green-500';
          break;
        case ActionKind.DELETE_ACCOUNT:
          component.value = UserRemoveIcon;
          color.value = 'bg-red-600';
          break;
        case ActionKind.FUNCTION_CALL:
          component.value = LightningBoltIcon;
          color.value = 'bg-yellow-400';
          break;
        case ActionKind.STAKE:
          component.value = LockClosedIcon;
          color.value = 'bg-purple-700';
          break;
        case ActionKind.TRANSFER:
          if (props.direction === 'receiver') {
            component.value = ArrowDownIcon;
            color.value = 'bg-gray-800';
          } else {
            component.value = ArrowUpIcon;
            color.value = 'bg-gray-800';
          }
          break;
        default:
          component.value = CubeTransparentIcon;
          color.value = 'bg-gray-500';
      }
    });

    return { component, color };
  },
});
</script>
