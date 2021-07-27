<template>
  <div class="flex flex-col py-8 md:py-32 px-2 md:px-20 space-y-48">
    <div class="prose-2xl text-center">
      <p><strong>Hey!</strong></p>
      <p>
        Are you curious about what NEAR account activity looks like in chart
        form?<br />Well, then, you're in luck, because
        <strong>stats.gallery</strong> is here for you!
      </p>
    </div>
    <div class="prose-2xl text-center">
      <h2 class="font-bold">Informative overview</h2>
      <img src="https://via.placeholder.com/1278x885" />
    </div>
    <div class="prose-2xl text-center">
      <h2 class="font-bold">Descriptive charts & graphs</h2>
      <img src="https://via.placeholder.com/1278x885" />
    </div>
    <div class="prose-2xl">
      <h2 class="font-bold text-center">Also,</h2>
      <div
        class="
          flex flex-wrap-reverse
          space-x-8
          w-full
          items-start
          justify-center
        "
      >
        <img src="https://via.placeholder.com/338x358" />
        <div class="flex flex-wrap max-w-2xl">
          <Card title="History">
            <h3 class="font-bold">History</h3>
            <p>
              Get and complete quests to receive more NEAR points and pump your
              account up!
            </p>
          </Card>
          <Card title="History">
            <h3 class="font-bold">Services</h3>
            <p>
              Get and complete quests to receive more NEAR points and pump your
              account up!
            </p>
          </Card>
          <Card title="History">
            <h3 class="font-bold">Quests</h3>
            <p>
              Get and complete quests to receive more NEAR points and pump your
              account up!
            </p>
          </Card>
          <Card title="History">
            <h3 class="font-bold">Transactions</h3>
            <p>
              Get and complete quests to receive more NEAR points and pump your
              account up!
            </p>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Card from './Card.vue';

export default defineComponent({
  components: { Card },
});
</script>
