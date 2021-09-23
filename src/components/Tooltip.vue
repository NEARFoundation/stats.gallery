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
            class="
              fixed
              z-50
              w-full
              sm:w-screen sm:max-w-sm
              mt-2
              transform
              -translate-x-1/2
            "
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
                mx-4
                sm:mx-0
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
      const fit = () => {
        if (panelRef.value && panelRef.value.el) {
          panelRef.value.el.style.marginLeft = '';
          const rect = panelRef.value.el.getBoundingClientRect();
          if (rect.x < 0) {
            panelRef.value.el.style.marginLeft = -rect.x + 5 + 'px';
          }
        }
      };

      const reposition = () => {
        if (buttonRef.value && buttonRef.value.el) {
          const el = buttonRef.value.el as HTMLButtonElement;
          const rect = el.getBoundingClientRect();
          top.value = rect.top + rect.height;
          // We have to do this calculation in JS because we're teleporting the
          // element, so we can't do it in CSS. :(
          left.value = rect.left + rect.width / 2;
        }
      };

      fit();
      reposition();

      window.addEventListener('resize', () => {
        reposition();
        fit();
      });
      window.addEventListener('scroll', reposition);

      watch(elRef, () => {
        reposition();
        fit();
      });
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
