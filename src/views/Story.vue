<template>
  <TopBar />
  <div class="prose prose-xl md:max-w-4xl mx-auto px-3 my-5">
    <h1>story</h1>
    <blockquote>
      Building software isn't just a job, it's a
      <strong><span class="text-purple-500">journey</span></strong
      >.
    </blockquote>
    <h2>the <span class="text-blue-500">problem</span></h2>
    <p>
      NEAR was still a new project, hot off the presses and lunging forward at
      full-steam, and people knew it. It seemed that every week there was a new
      development:
      <external-link href="https://aurora.dev/">Aurora</external-link>,
      <external-link href="https://oct.network/">Octopus</external-link>,
      <external-link href="https://skyward.finance/">Skyward</external-link>,
      <external-link href="https://app.ref.finance/">Ref Finance</external-link
      >,
      <external-link href="https://berryclub.io/">Berry Club</external-link
      >&hellip; the list goes on.
    </p>
    <p>
      Developers were adopting the platform at breakneck speed, and the team at
      NEAR worked tirelessly on Explorer and Wallet to make sure that the core
      ecosystem tools could support the influx of developer interest.
    </p>
    <p>
      Hi. I'm Jacob, the developer of
      <strong><span class="text-purple-500">stats.gallery</span></strong
      >. I saw NEAR as a great, burgeoning platform that was extremely
      developer-friendly and was poised to make some big waves in the crypto
      space.
    </p>
    <p>
      However, developer adoption is just one step in the process to going
      mainstream. Wallet and Explorer are great tools for everybody to clearly
      see the spicy details of their accounts and the whole network, but they're
      a specific type of tool: indicators that provide information, but don't
      necessarily delineate a path forward.
    </p>
    <p>
      <strong><span class="text-purple-500">stats.gallery</span></strong>
      strives to be that friendly guide.
    </p>
    <h2>the <span class="text-pink-500">guide</span></h2>
    <p class="italic">[Description of the software and how to use it.]</p>
    <h2>the <span class="text-yellow-500">future</span></h2>
    <p>
      There's a lot we have planned for this project which you can explore in
      the project roadmap below. If you see something you'd like to help with or
      if you think something's missing, give us a holler!
    </p>
    <div class="flex flex-col md:flex-row justify-around md:space-x-5">
      <div class="flex-1 flex flex-col space-y-3">
        <h3 class="text-center font-bold text-3xl">Done</h3>
        <RoadmapCard
          dateClass="bg-pink-500"
          v-for="(task, i) in completedTasks"
          :key="i"
          :date="task.date"
          :href="task.link"
          :name="task.name"
          :done="task.done"
        />
      </div>
      <div class="flex-1 flex flex-col space-y-3">
        <h3 class="text-center font-bold text-3xl">Doing</h3>
        <RoadmapCard
          dateClass="bg-green-500"
          v-for="(task, i) in currentTasks"
          :key="i"
          :date="task.date"
          :href="task.link"
          :name="task.name"
          :done="task.done"
        />
      </div>
      <div class="flex-1 flex flex-col space-y-3">
        <h3 class="text-center font-bold text-3xl">To Do</h3>
        <RoadmapCard
          v-for="(task, i) in futureTasks"
          :dateClass="futureTaskColor(task)"
          :key="i"
          :date="task.date"
          :href="task.link"
          :name="task.name"
          :done="task.done"
        />
      </div>
    </div>
    <h2>the <span class="text-green-600">team</span></h2>
    <p class="italic">[Bios and overview of the current development team.]</p>
  </div>
  <Footer />
</template>

<style scoped>
.prose,
.prose h1,
.prose h2,
.prose blockquote {
  @apply dark:text-gray-100;
}

.prose a {
  @apply dark:text-white;
}
</style>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import TopBar from '@/components/navigation/TopBar.vue';
import { DateTime } from 'luxon';
import { defineComponent, ref } from 'vue';
import RoadmapCard from './story/RoadmapCard.vue';
import { RoadmapTask, tasks } from './story/tasks';

export default defineComponent({
  components: {
    TopBar,
    Footer,
    RoadmapCard,
  },
  setup() {
    const futureTasks: RoadmapTask[] = [];
    const currentTasks: RoadmapTask[] = [];
    const completedTasks: RoadmapTask[] = [];

    const futureTaskColor = (task: RoadmapTask) => {
      const then = DateTime.fromJSDate(task.date);
      const diff = then.diffNow('months').months;
      if (diff > 3) {
        return 'bg-gray-700';
      } else if (diff > 2) {
        return 'bg-purple-500';
      } else if (diff > 1) {
        return 'bg-indigo-600';
      } else {
        return 'bg-blue-500';
      }
    };

    const currentMonth = DateTime.now().startOf('month').toMillis();

    tasks
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .forEach(task => {
        if (
          DateTime.fromJSDate(task.date).startOf('month').toMillis() ===
          currentMonth
        ) {
          currentTasks.push(task);
        } else if (task.done) {
          completedTasks.push(task);
        } else {
          futureTasks.push(task);
        }
      });

    return {
      futureTasks,
      currentTasks,
      completedTasks,
      futureTaskColor,
    };
  },
});
</script>
