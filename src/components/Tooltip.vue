<template>
  <client-only>
    <Popover v-slot="{ open }">
      <PopoverButton ref="buttonRef" v-bind="$attrs">
        <slot name="trigger" :open="open" />
      </PopoverButton>
      <AutoTeleport>
        <Float
          snap="center"
          v-slot="{ left, top }"
          v-if="buttonRef"
          :anchorRef="buttonRef"
          :targetRef="panelRef"
          :watchRef="elRef || {}"
        >
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
                  rounded-sm
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
        </Float>
      </AutoTeleport>
    </Popover>
  </client-only>
</template>

<script lang="ts">
import Float from '@/components/Float.vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { defineComponent, ref, VNode } from 'vue';
import AutoTeleport from './AutoTeleport.vue';

export default defineComponent({
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    Float,
    AutoTeleport,
  },
  setup() {
    const panelRef = ref<VNode | null>(null);
    const elRef = ref<HTMLElement | null>(null);
    const buttonRef = ref<VNode | null>(null);

    return {
      panelRef,
      elRef,
      buttonRef,
    };
  },
});
</script>
