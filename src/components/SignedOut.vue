<template>
  <main>
    <p class="sign-text">
      <button v-on:click="login">Sign in</button>
    </p>
  </main>
</template>

<style scoped>
.sign-text {
  text-align: center;
}
</style>
<script>
import { login } from '../utils/util';

export default {
  name: 'SignedOut',

  methods: {
    login() {
      console.log('calling utils.login');
      login();
    },
  },
};
</script>
