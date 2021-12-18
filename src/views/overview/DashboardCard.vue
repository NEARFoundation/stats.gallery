<template>
  <div
    class="group shadow-lg rounded-md bg-white dark:bg-gray-800 flex flex-col"
  >
    <header
      class="
        relative
        bg-gray-50
        dark:bg-gray-900
        px-3
        border-b-2 border-gray-200
        dark:border-gray-800
        rounded-t-md
        flex
        items-center
      "
    >
      <span
        class="py-2 text-lg text-gray-800 dark:text-white font-bold truncate"
        >{{ title }}</span
      >
      <HelpTooltip v-if="!!$slots.help && !isEmbedded" class="ml-1">
        <slot name="help" />
      </HelpTooltip>
      <template v-if="!!$slots.action && !isEmbedded">
        <div class="flex-1 self-stretch flex items-center px-1 truncate">
          <div class="flex-1"></div>
          <slot name="action" />
        </div>
      </template>
      <button
        v-if="showEmbedButton"
        class="
          absolute
          z-10
          p-1
          m-1
          rounded-sm
          top-full
          right-0
          transition-all
          duration-75
          text-gray-500 text-opacity-30
          hover:text-opacity-60 hover:bg-gray-600 hover:bg-opacity-10
          focus-visible:text-opacity-60
          focus-visible:bg-gray-600
          focus-visible:bg-opacity-10
          focus-visible:opacity-100
          opacity-0
          group-hover:opacity-100
          z-40
        "
        @click="isEmbedModalOpen = true"
      >
        <CodeIcon class="w-6" />
      </button>
    </header>
    <Modal
      v-if="showEmbedButton"
      :open="isEmbedModalOpen"
      @close="isEmbedModalOpen = false"
      title="Embed Code"
      prose
    >
      <template #default>
        <p>Copy this code to your website:</p>
        <input
          type="text"
          :value="embedCode"
          class="
            w-full
            cursor-pointer
            bg-gray-300
            font-mono
            text-gray-700
            py-1
            px-2
            rounded-md
          "
          style="min-width: 400px"
          readonly
          @click="copyCode"
        />
      </template>
      <template #footer>
        <div class="font-bold flex items-center">
          <ArrowSmUpIcon
            v-if="copyState === 'pending'"
            class="w-6 text-gray-700"
          />
          <span v-if="copyState === 'pending'">Click to copy</span>
          <span v-if="copyState === 'success'" class="text-green-600"
            >Copied!</span
          >
          <span v-if="copyState === 'failure'" class="text-red-600"
            >Failed to copy</span
          >
          <ArrowSmUpIcon
            v-if="copyState === 'pending'"
            class="w-6 text-gray-700"
          />
        </div>
      </template>
    </Modal>
    <slot />
  </div>
</template>

<script lang="ts">
import Modal from '@/components/Modal.vue';
import HelpTooltip from '@/components/HelpTooltip.vue';
import { useNear } from '@/composables/useNear';
import { CodeIcon, ArrowSmUpIcon } from 'heroicons-vue3/solid';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import copy from 'clipboard-copy';

export default defineComponent({
  components: {
    HelpTooltip,
    Modal,
    CodeIcon,
    ArrowSmUpIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    embed: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const isEmbedModalOpen = ref(false);

    const { account, network, timeframe } = useNear();

    const router = useRouter();

    const isEmbedded =
      router.currentRoute.value.name?.toString().startsWith('embed:') ?? false;

    const showEmbedButton = computed(() => !!props.embed && !isEmbedded);

    const getEmbedUrl = () => {
      if (props.embed) {
        const { href } = router.resolve({
          name: props.embed,
          params: {
            account: account.value,
            network: network.value,
          },
          query: {
            t: timeframe.value,
          },
        });

        return location.origin + href;
      } else {
        return '';
      }
    };

    const embedCode = computed(() => {
      const url = getEmbedUrl();
      return `<iframe src="${url}" width="320" height="380" frameborder="0" allowtransparency="true"></iframe>`;
    });

    const copyCode = () => {
      copy(embedCode.value)
        .then(() => {
          copyState.value = 'success';
        })
        .catch(() => {
          copyState.value = 'failure';
        })
        .then(() => {
          setTimeout(() => {
            copyState.value = 'pending';
          }, 3000);
        });
    };

    const copyState = ref('pending' as 'pending' | 'success' | 'failure');

    return {
      isEmbedModalOpen,
      showEmbedButton,
      embedCode,
      isEmbedded,
      copyCode,
      copyState,
    };
  },
});
</script>
