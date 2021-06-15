<template>
  <small class="text-xl font-bold text-gray-300">NEAR Stats</small>
  <h2 class="text-4xl font-bold leading-3">account.near</h2>
  <!-- Large stats display -->
  <dl
    class="
      mt-10
      text-center
      sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8
    "
  >
    <div class="flex flex-col">
      <dt class="order-2 mt-2 text-lg leading-6 font-medium text-gray-600">
        Pepperoni
      </dt>
      <dd class="order-1 text-5xl font-extrabold text-gray-800">100%</dd>
    </div>
    <div class="flex flex-col mt-10 sm:mt-0">
      <dt class="order-2 mt-2 text-lg leading-6 font-medium text-gray-600">
        Delivery
      </dt>
      <dd class="order-1 text-5xl font-extrabold text-gray-800">24/7</dd>
    </div>
    <div class="flex flex-col mt-10 sm:mt-0">
      <dt class="order-2 mt-2 text-lg leading-6 font-medium text-gray-600">
        Calories
      </dt>
      <dd class="order-1 text-5xl font-extrabold text-gray-800">100k+</dd>
    </div>
  </dl>

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
import { networks, RestDatabaseClient } from '@/services/restdb';
import { ref } from '@vue/reactivity';
import { defineComponent } from '@vue/runtime-core';

const db = new RestDatabaseClient(networks.mainnet);

export default defineComponent({
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
});
</script>
