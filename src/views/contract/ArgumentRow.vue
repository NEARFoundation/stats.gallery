<template>
  <div class="flex flex-row flex-wrap gap-5 items-stretch">
    <Labeled label="Use">
      <input
        class="w-4 h-4 flex-grow self-center"
        type="checkbox"
        :checked="active"
        @change="$emit('update:active', $event.target.checked)"
      />
    </Labeled>
    <Labeled label="Field Name">
      <SmallTextInput
        theme="light"
        class="w-48"
        :modelValue="field"
        @update:modelValue="$emit('update:field', $event)"
        :disabled="locked"
      />
    </Labeled>
    <Labeled label="Data Type">
      <SmallSelectInput
        theme="light"
        class="w-32"
        :modelValue="type"
        @update:modelValue="$emit('update:type', $event)"
        :options="typeStrings"
      />
    </Labeled>
    <Labeled label="Value">
      <div class="relative">
        <SmallTextInput
          theme="light"
          class="w-48"
          :modelValue="value"
          @update:modelValue="$emit('update:value', $event)"
        />
        <div
          v-if="type === 'auto'"
          class="
            text-xs
            absolute
            rounded-sm
            shadow-sm
            top-0
            right-1
            px-1
            py-0.5
            transform
            -translate-y-3/4
            bg-blue-600
            text-white
            font-mono font-bold
            ring-2 ring-white
          "
        >
          {{ guess.type }}
        </div>
      </div>
    </Labeled>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import SmallTextInput from '@/components/form/SmallTextInput.vue';
import SmallSelectInput from '@/components/form/SmallSelectInput.vue';
import { GuessableTypeString, guessType } from '@/utils/guessType';
import Labeled from './Labeled.vue';

export default defineComponent({
  components: {
    SmallTextInput,
    SmallSelectInput,
    Labeled,
  },
  props: {
    locked: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    active: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    field: {
      type: String as PropType<string>,
      required: true,
    },
    type: {
      type: String as PropType<GuessableTypeString | 'auto'>,
      required: true,
    },
    value: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:active', 'update:field', 'update:type', 'update:value'],
  setup(props) {
    const typeStrings = [
      {
        label: 'Auto',
        value: 'auto',
      },
      {
        label: 'String',
        value: 'string',
      },
      {
        label: 'Number',
        value: 'number',
      },
      {
        label: 'Boolean',
        value: 'boolean',
      },
      {
        label: 'Null',
        value: 'null',
      },
      {
        label: 'Raw JSON',
        value: 'json',
      },
    ];

    const guess = computed(() =>
      props.type === 'auto' ? guessType(props.value) : 'unknown',
    );

    return {
      typeStrings,
      guess,
    };
  },
});
</script>
