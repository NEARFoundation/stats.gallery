<template>
  <button
    type="button"
    @click="run"
    class="
      inline-flex
      items-center
      px-4
      py-2
      border border-transparent
      text-sm
      font-medium
      rounded-md
      shadow-sm
      text-white
      bg-indigo-600
      hover:bg-indigo-700
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    "
  >
    Request Access Keys
  </button>
  <p v-if="requestInFlight">Requesting...</p>
  <pre v-if="!requestInFlight && msg !== null">{{ msg }}</pre>
</template>

<script lang="ts">
import { configurations, RestDatabaseClient } from '@/services/restdb';
import { ref } from '@vue/reactivity';

const db = new RestDatabaseClient(configurations.mainnet);

export default {
  setup() {
    const msg = ref(null as null | string);
    const requestInFlight = ref(false);

    const run = async () => {
      msg.value = null;
      requestInFlight.value = true;
      const accessKeys = await db.getAccessKeys('hatchet.near');
      msg.value = accessKeys.map(key => key.public_key).join('\n');
      requestInFlight.value = false;
    };

    return {
      msg,
      requestInFlight,
      run,
    };
  },
};
</script>
