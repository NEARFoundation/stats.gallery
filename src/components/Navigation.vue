<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div
          class="
            sm:flex-1
            flex
            items-center
            justify-center
            sm:items-stretch sm:justify-start
          "
        >
          <!-- Brand icon -->
          <div class="flex-shrink-0 flex items-center">
            <img
              class="block lg:hidden h-8 w-auto"
              src="../assets/near_icon_wht.svg"
              alt="Workflow"
            />
            <img
              class="hidden lg:block h-8 w-auto"
              src="../assets/near_icon_wht.svg"
              alt="Workflow"
            />
          </div>

          <!-- Nav links -->
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'px-3 py-2 rounded-md text-sm font-medium',
                ]"
                :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</a
              >
            </div>
          </div>
        </div>

        <!-- Search section -->
        <div class="flex-1 flex justify-center sm:justify-end">
          <div class="w-full px-2 lg:px-6">
            <label for="search" class="sr-only">Input account name</label>
            <div class="relative text-indigo-200 focus-within:text-gray-400">
              <div
                class="
                  absolute
                  inset-y-0
                  left-0
                  pl-3
                  flex
                  items-center
                  pointer-events-none
                "
              >
                <SearchIcon class="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                class="
                  block
                  w-full
                  pl-10
                  pr-3
                  py-2
                  border border-transparent
                  rounded-md
                  leading-5
                  bg-indigo-400 bg-opacity-25
                  text-indigo-100
                  placeholder-indigo-200
                  focus:outline-none
                  focus:bg-white
                  focus:ring-0
                  focus:placeholder-gray-400
                  focus:text-gray-900
                  sm:text-sm
                "
                placeholder="account.near&hellip;"
                type="search"
              />
            </div>
          </div>
        </div>

        <!-- Mobile menu button-->
        <div class="flex items-center sm:hidden">
          <DisclosureButton
            class="
              inline-flex
              items-center
              justify-center
              p-2
              rounded-md
              text-gray-400
              hover:text-white hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
            "
          >
            <span class="sr-only">Open main menu</span>
            <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</router-link
        >
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { MenuIcon, XIcon, SearchIcon } from 'heroicons-vue3/outline';

const navigation = [
  { name: 'Activity', href: '#', current: true },
  { name: 'Charts', href: '#', current: false },
  { name: 'Help', href: '#', current: false },
];

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    MenuIcon,
    XIcon,
    SearchIcon,
  },
  setup(): unknown {
    const open = ref(false);

    return {
      navigation,
      open,
    };
  },
};
</script>
