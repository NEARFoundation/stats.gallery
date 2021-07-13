<template>
  <div class="rounded-md bg-red-50 p-4 max-w-2xl mx-auto">
    <div class="flex">
      <div class="flex-shrink-0">
        <ExclamationIcon class="h-5 w-5 text-red-500" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ account }} may not exist
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>The account ID entered could not be found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExclamationIcon } from 'heroicons-vue3/outline';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    ExclamationIcon,
  },
  props: {
    account: {
      type: String,
      required: true,
    },
  },
});
</script>
