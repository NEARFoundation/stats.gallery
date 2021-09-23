<template>
  <client-only>
    <Popover v-slot="{ open }" class="sm:relative">
      <PopoverButton>
        <slot name="trigger" :open="open" />
      </PopoverButton>
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel
          ref="panelRef"
          class="
            absolute
            sm:top-full
            left-0
            sm:left-1/2 sm:transform sm:-translate-x-1/2
            z-50
            w-full
            sm:w-screen
            mt-1
            sm:max-w-sm
          "
        >
          <div
            ref="elRef"
            class="
              overflow-hidden
              rounded-md
              shadow-lg
              bg-gray-900 bg-opacity-80
              backdrop-filter backdrop-blur-sm
              text-white
              p-3
              mx-4
              sm:mx-0
            "
          >
            <slot name="content" :open="open" />
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </client-only>
</template>

<script lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { defineComponent, onMounted, ref, VNode, watch } from 'vue';

export default defineComponent({
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
  },
  setup() {
    const panelRef = ref<VNode | null>(null);
    const elRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      const fit = () => {
        if (panelRef.value && panelRef.value.el) {
          panelRef.value.el.style.marginLeft = '';
          const rect = panelRef.value.el.getBoundingClientRect();
          if (rect.x < 0) {
            panelRef.value.el.style.marginLeft = -rect.x + 5 + 'px';
          }
        }
      };

      fit();

      window.addEventListener('resize', fit);

      watch(elRef, fit);
    });

    return {
      panelRef,
      elRef,
    };
  },
});
</script>
