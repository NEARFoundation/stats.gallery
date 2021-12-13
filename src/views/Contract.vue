<template>
  <main class="flex-grow flex flex-col space-y-3">
    <DashboardCard title="Contract Interactions">
      <div class="flex flex-col space-y-3 p-3">
        <h3 class="font-normal">Interfaces</h3>
        <ul class="flex flex-col mx-3">
          <li
            v-for="interfaceId in contract.probableInterfaces"
            :key="interfaceId"
            class="m-1 px-4 py-2 font-medium rounded-full"
          >
            <div>{{ interfaces[interfaceId].name }}</div>
            <div class="space-y-2 mt-2">
              <Method
                v-for="method in interfaces[interfaceId].methods"
                :key="method.name"
                :methodName="method.name"
                :suggestedArguments="method.args"
              />
            </div>
          </li>
        </ul>
        <h3 class="font-normal">Contract Methods</h3>
        <div class="flex flex-col bg-gray-800 divide-y divide-gray-700">
          <div
            v-for="methodName in contract.methodNames"
            :key="methodName"
            class="grid grid-cols-4 py-3"
          >
            <div class="col-span-1">
              <code
                class="
                  bg-gray-200
                  dark:bg-gray-900
                  truncate
                  max-w-xs
                  px-1
                  font-mono
                  rounded
                  text-gray-500
                  dark:text-gray-300
                  text-sm
                "
                >{{ methodName }}</code
              >
            </div>
            <div class="col-span-2 flex flex-col">
              <div
                v-for="interfaceId in contract.byMethod[methodName]"
                :key="interfaceId"
              >
                {{ interfaces[interfaceId].name }}
              </div>
            </div>
            <div class="col-span-1"></div>
            <div class="col-span-full mt-2 space-y-1 flex flex-col">
              <div class="flex flex-row">
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Argument 1"
                  />
                </div>
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Value 1"
                  />
                </div>
              </div>
              <div class="flex flex-row">
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Argument 2"
                  />
                </div>
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Value 2"
                  />
                </div>
              </div>
            </div>
            <div class="col-span-3"></div>
            <div class="col-span-1">
              <button class="px-3 py-2 bg-blue-700 rounded-md">Run</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  </main>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { useContract } from '@/composables/contract/useContract';
import { defineComponent, reactive, ref, watch } from 'vue';
import { interfaces } from '@/composables/contract/interfaces';
import DashboardCard from './overview/DashboardCard.vue';
import Method from './contract/Method.vue';

export default defineComponent({
  components: {
    DashboardCard,
    Method,
  },
  setup() {
    const { account, network } = useNear();
    const { contract, isLoading } = useContract({ account, network });
    const args = reactive(new Map<string, { name: string; value: string }>());

    return {
      contract,
      isLoading,
      interfaces,
      args,
    };
  },
});
</script>
