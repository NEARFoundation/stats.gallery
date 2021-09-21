<template>
  <main>
    <p style="text-align:center;">
      <button v-on:click="login">Sign in</button>
    </p>
  </main>
</template>

<script>
import { login } from "../utils/util"

export default {
  name: "SignedOut",

  methods: {
    login() {
      console.log("calling utils.login")
      login()
    },
  },
}
</script>
