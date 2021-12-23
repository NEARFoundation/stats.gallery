<template>
  <client-only>
    <Listbox
      as="div"
      v-bind="$attrs"
      class="relative"
      :modelValue="selectedOption"
      @update:modelValue="
        $event => {
          const oldValue = selectedOption.value;
          $emit('update:modelValue', $event.value);
          $emit('change', $event.value, oldValue);
        }
      "
    >
      <ListboxButton
        ref="anchorRef"
        class="
          w-full
          h-full
          cursor-pointer
          relative
          rounded-sm
          p-2
          pl-3
          pr-8
          border
          text-left
          bg-white
          hover:bg-gray-100
          border-gray-300
          dark:bg-gray-700
          dark:hover:bg-gray-800
          dark:border-gray-600
          dark:text-white
        "
      >
        <span class="block truncate text-base text-black dark:text-white">{{
          selectedOption.label
        }}</span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            pointer-events-none
          "
        >
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <AutoTeleport>
        <Float
          snap="left"
          v-slot="{ left, top, width }"
          v-if="anchorRef"
          :anchorRef="anchorRef"
          :targetRef="targetRef"
          :watchRef="watchRef || {}"
        >
          <div
            ref="targetRef"
            class="fixed z-50"
            :style="{
              top: top + 'px',
              left: left + 'px',
              width: width + 'px',
            }"
          >
            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="
                  mt-1
                  w-full
                  shadow-lg
                  max-h-60
                  rounded-sm
                  py-1
                  ring-1 ring-black ring-opacity-5
                  overflow-auto
                  custom-scrollbar
                  focus:outline-none
                  text-base
                  bg-white
                  dark:bg-gray-700
                "
              >
                <ListboxOption
                  ref="watchRef"
                  as="template"
                  v-for="option in options"
                  :key="option.value"
                  :value="option"
                  v-slot="{ active }"
                >
                  <li
                    class="
                      text-black
                      dark:text-white
                      cursor-pointer
                      select-none
                      relative
                      py-2
                      px-3
                    "
                    :class="[active && 'bg-gray-100 dark:bg-gray-800']"
                  >
                    <span class="block truncate">
                      {{ option.label }}
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Float>
      </AutoTeleport>
    </Listbox>
  </client-only>
</template>

<script lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { SelectorIcon } from 'heroicons-vue3/outline';
import { computed, defineComponent, PropType, ref } from 'vue';
import AutoTeleport from '../AutoTeleport.vue';
import Float from '../Float.vue';

export default defineComponent({
  components: {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    SelectorIcon,
    Float,
    AutoTeleport,
  },
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
    options: {
      type: Array as PropType<{ label: string; value: string }[]>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const anchorRef = ref(null);
    const targetRef = ref(null);
    const watchRef = ref(null);

    const selectedOption = computed(() =>
      props.options.find(o => o.value === props.modelValue),
    );

    return {
      anchorRef,
      targetRef,
      watchRef,
      selectedOption,
    };
  },
});
</script>
