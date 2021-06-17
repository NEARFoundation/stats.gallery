import { reactive, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { Network } from './networks';
import { NearClient } from './NearClient';

// TODO: Remember last selected network in localStorage
const initialNetwork = Network.MAINNET;

export const network = ref(initialNetwork);
export const client = reactive(new NearClient(initialNetwork));

watch(network, newNetwork => {
  client.network = newNetwork;
});
