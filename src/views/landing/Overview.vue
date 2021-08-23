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
    <div class="prose-2xl">
      <h2 class="font-bold text-center">Also,</h2>
    </div>
    <div class="flex flex-wrap space-x-8 w-full items-start justify-center">
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
        <img src="@/assets/landing/sm/gizmo.png" style="" />
      </picture>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Card from './Card.vue';

export default defineComponent({
  components: { Card },
});
</script>
