<template>
  <div class="flex gap-3 items-center">
    <external-link
      :href="href"
      class="inline-flex items-center font-mono underline"
    >
      {{ hash }}
      <external-link-icon class="w-3 h-3 ml-1.5" />
    </external-link>
    <button
      class="bg-gray-200 text-black font-mono py-1 px-2 rounded-sm text-sm"
      @click="log"
    >
      console.log
    </button>
  </div>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { networks } from '@/services/near/indexer/networks';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue';

export default defineComponent({
  props: {
    hash: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const { connection, walletAuth, network } = useNear();
    const status = ref<FinalExecutionOutcome | null>();

    watch(
      [toRefs(props).hash, connection],
      async ([hash, connection]) => {
        const s = await connection!.connection.provider.txStatus(
          hash,
          walletAuth.accountId,
        );
        status.value = s;
      },
      { immediate: true },
    );

    const log = () => {
      console.log(props.hash, JSON.parse(JSON.stringify(status.value)));
    };

    const href = computed(
      () => networks[network.value].explorer + '/transactions/' + props.hash,
    );

    return {
      log,
      href,
      status,
    };
  },
});
</script>
