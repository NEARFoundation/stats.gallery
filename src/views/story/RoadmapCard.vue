<template>
  <div
    :class="[
      done ? 'bg-gray-400 bg-opacity-20 shadow-inner' : 'bg-white shadow-md',
    ]"
    class="rounded-md py-3 px-5 relative"
  >
    <CheckIcon v-if="done" class="absolute top-3 right-3 w-6 text-green-600" />
    <div class="font-medium text-lg pr-5">{{ name }}</div>
    <div
      :class="dateClass"
      class="inline-block text-sm text-white uppercase px-3 rounded font-bold"
    >
      {{ monthName }} {{ year }}
    </div>
    <external-link v-if="href !== ''" :href="href" class="float-right">
      <span class="inline-flex items-center text-sm text-blue-600 underline">
        <span>View</span>
        <external-link-icon class="ml-1" />
      </span>
    </external-link>
  </div>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import { defineComponent, ref, toRefs, watch } from 'vue';
import { CheckIcon } from 'heroicons-vue3/solid';

export default defineComponent({
  components: {
    CheckIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
    dateClass: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const monthName = ref('');
    const year = ref('');

    watch(
      toRefs(props).date,
      date => {
        const d = DateTime.fromJSDate(date);
        monthName.value = d.monthLong;
        year.value = d.year + '';
      },
      { immediate: true },
    );

    return {
      monthName,
      year,
    };
  },
});
</script>
