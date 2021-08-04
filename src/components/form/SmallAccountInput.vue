<template>
  <div class="flex">
    <input
      :value="modelValue.toLowerCase()"
      @input="$emit('update:modelValue', $event.target.value.toLowerCase())"
      type="text"
      class="
        text-base text-black
        focus:ring-green-500 focus:ring-2
        font-normal
        block
        w-full
        outline-none
        rounded-l-sm
        border border-gray-300 border-r-0
        p-2
        z-10
      "
      placeholder="account-name"
    />
    <Switch
      v-model="isSuffixActive"
      class="
        z-0
        inline-flex
        items-center
        px-2
        rounded-r-sm
        border border-gray-300
        text-base text-gray-500
        bg-gray-100
      "
    >
      <span class="sr-only">Use .near suffix</span>
      <span v-if="isSuffixActive" aria-hidden="true">.near</span>
      <span v-else aria-hidden="true"><s>.near</s></span>
    </Switch>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Switch } from '@headlessui/vue';

export default defineComponent({
  components: {
    Switch,
  },
  name: 'account-input',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    const isSuffixActive = ref(true);

    return {
      isSuffixActive,
    };
  },
});
</script>
