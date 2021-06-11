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
  <pre v-if="!requestInFlight && data !== null">{{ data }}</pre>
</template>

<script lang="ts">
import { networkConfigurations, NetworkDatabase } from '@/services';

const db = new NetworkDatabase(networkConfigurations.mainnet);

export default {
  data() {
    return {
      requestInFlight: false,
      data: null as null | string,
    };
  },
  methods: {
    async run() {
      this.data = null;
      this.requestInFlight = true;
      const accessKeys = await db.getAccessKeys('hatchet.near');
      this.data = accessKeys.map(key => key.public_key).join('\n');
      this.requestInFlight = false;
    },
  },
};
</script>
