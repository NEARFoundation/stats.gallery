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
import { defineComponent, Component, PropType } from 'vue';
import { RouteLocation } from 'vue-router';
import SectionLinkInternal from './SectionLinkInternal.vue';

export default defineComponent({
  components: {
    SectionLinkInternal,
  },
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
    icon: {
      type: [Object, Function],
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
