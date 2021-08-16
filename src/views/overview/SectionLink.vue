<template>
  <SectionLinkInternal
    v-if="external"
    :external="external"
    :icon="icon"
    :name="name"
    :href="to"
    :isActive="false"
  />
  <router-link v-else custom :to="to" v-slot="{ href, navigate, isActive }">
    <SectionLinkInternal
      :external="external"
      :icon="icon"
      :name="name"
      :href="href"
      :isActive="isActive"
      @click="navigate"
    />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, Component } from 'vue';
import SectionLinkInternal from './SectionLinkInternal.vue';

export default defineComponent({
  components: {
    SectionLinkInternal,
  },
  props: {
    to: {
      type: String,
      required: true,
    },
    icon: {
      type: Object as () => Component,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    external: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
