<template>
  <div class="flex flex-col py-8 md:py-32 px-2 md:px-20 space-y-24">
    <div class="prose-2xl text-center mb-12">
      <p class="text-3xl pt-12 lg:pt-0">
        <strong>Hey!</strong>
      </p>
      <p>
        Are you curious about what NEAR account activity looks like in chart
        form?<br />Well, then, you're in luck, because
        <strong>stats.gallery</strong> is here for you!
      </p>
    </div>
    <div class="prose-2xl text-center">
      <h2 class="font-bold">Informative overview</h2>
      <picture>
        <source
          media="(min-width: 768px)"
          srcset="@/assets/landing/lg/overview.png"
        />
        <source
          media="(min-width: 480px)"
          srcset="@/assets/landing/md/overview.png"
        />
        <source
          media="(min-width: 0px)"
          srcset="@/assets/landing/sm/overview.png"
        />
        <img src="@/assets/landing/sm/overview.png" style="margin: 0 auto" />
      </picture>
    </div>
    <div class="prose-2xl text-center">
      <h2 class="font-bold">Descriptive charts & graphs</h2>
      <picture>
        <source
          media="(min-width: 768px)"
          srcset="@/assets/landing/lg/charts.png"
        />
        <source
          media="(min-width: 480px)"
          srcset="@/assets/landing/md/charts.png"
        />
        <source
          media="(min-width: 0px)"
          srcset="@/assets/landing/sm/charts.png"
        />
        <img src="@/assets/landing/sm/charts.png" style="margin: 0 auto" />
      </picture>
    </div>

    <div>
      <div class="prose-2xl">
        <h2 class="font-bold text-center pb-12">Also,</h2>
      </div>
      <div
        class="flex flex-wrap lg:space-x-24 w-full items-start justify-center"
      >
        <picture>
          <source
            media="(min-width: 768px)"
            srcset="@/assets/landing/lg/gizmo.png"
          />
          <source
            media="(min-width: 480px)"
            srcset="@/assets/landing/md/gizmo.png"
          />
          <source
            media="(min-width: 0px)"
            srcset="@/assets/landing/sm/gizmo.png"
          />
          <img src="@/assets/landing/sm/gizmo.png" />
        </picture>
        <div class="flex flex-wrap max-w-2xl">
          <Card title="History">
            <h3 class="font-bold">History</h3>
            <p>See all of your progress in one place!</p>
          </Card>
          <Card title="Resources">
            <h3 class="font-bold">Resources</h3>
            <p>Guides and tutorials from around the network!</p>
          </Card>
          <Card title="Quests">
            <h3 class="font-bold">Quests</h3>
            <p>Get and complete quests to pump your account up!</p>
          </Card>
          <Card title="Transactions">
            <h3 class="font-bold">Transactions</h3>
            <p>Meticulous records of each and every on-chain action!</p>
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
