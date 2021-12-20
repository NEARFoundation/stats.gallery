<template>
  <div class="flex gap-3 items-center">
    <external-link
      :href="href"
      class="inline-flex items-center font-mono underline"
    >
      {{ hash }}
      <external-link-icon class="w-3 h-3 ml-1.5" />
    </external-link>
    <PendingButton
      class="font-mono"
      @click="log"
      :mode="status ? 'normal' : 'pending'"
    >
      log
    </PendingButton>
  </div>
</template>

<script lang="ts">
import PendingButton from '@/components/form/PendingButton.vue';
import { useNear } from '@/composables/useNear';
import { networks } from '@/services/near/indexer/networks';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue';

export default defineComponent({
  components: { PendingButton },
  props: {
    hash: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const { connection, walletAuth, network } = useNear();
    const status = ref<FinalExecutionOutcome | null>(null);

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
