<template>
  <client-only>
    <Popover v-slot="{ open }" v-bind="$attrs">
      <PopoverButton ref="buttonRef">
        <slot name="trigger" :open="open" />
      </PopoverButton>
      <teleport to="#tooltips">
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
            class="fixed z-50 sm:w-full max-w-sm mt-2"
            :style="{
              left: left + 'px',
              top: top + 'px',
            }"
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
              "
            >
              <slot name="content" :open="open" />
            </div>
          </PopoverPanel>
        </transition>
      </teleport>
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
    const buttonRef = ref<VNode | null>(null);

    const left = ref(0);
    const top = ref(0);

    onMounted(() => {
      const reposition = () => {
        if (
          buttonRef.value &&
          buttonRef.value.el &&
          panelRef.value &&
          panelRef.value.el
        ) {
          const button = buttonRef.value.el as HTMLButtonElement;
          const panel = panelRef.value.el as HTMLDivElement;
          const buttonRect = button.getBoundingClientRect();
          const panelRect = panel.getBoundingClientRect();
          top.value = buttonRect.top + buttonRect.height;

          const xGap = 5;
          left.value = Math.max(
            0 + xGap,
            Math.min(
              buttonRect.left + buttonRect.width / 2 - panelRect.width / 2,
              document.documentElement.clientWidth - panelRect.width - xGap,
            ),
          );
        }
      };

      reposition();

      window.addEventListener('resize', reposition);
      window.addEventListener('scroll', reposition);

      watch(elRef, reposition);
    });

    return {
      panelRef,
      elRef,
      buttonRef,
      left,
      top,
    };
  },
});
</script>
