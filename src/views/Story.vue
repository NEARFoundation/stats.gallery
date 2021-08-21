<template>
  <TopBar />
  <div class="md:max-w-4xl mx-auto px-3 my-5 space-y-7">
    <div class="prose prose-xl">
      <h1>story</h1>
      <blockquote>
        Building software isn't just a job, it's a
        <strong><span class="text-purple-500">journey</span></strong
        >.
      </blockquote>
    </div>
    <div class="prose prose-xl">
      <h2>the <span class="text-blue-500">problem</span></h2>
      <p>
        NEAR was still a new project, hot off the presses and lunging forward at
        full-steam, and people knew it. It seemed that every week there was a
        new development:
        <external-link href="https://aurora.dev/">Aurora</external-link>,
        <external-link href="https://oct.network/">Octopus</external-link>,
        <external-link href="https://skyward.finance/">Skyward</external-link>,
        <external-link href="https://app.ref.finance/"
          >Ref Finance</external-link
        >,
        <external-link href="https://berryclub.io/">Berry Club</external-link
        >&hellip; the list goes on.
      </p>
      <p>
        Developers were adopting the platform at breakneck speed, and the team
        at NEAR worked tirelessly on Explorer and Wallet to make sure that the
        core ecosystem tools could support the influx of developer interest.
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
        see the spicy details of their accounts and the whole network, but
        they're a specific type of tool: indicators that provide information,
        but don't necessarily delineate a path forward.
      </p>
      <p>
        <strong><span class="text-purple-500">stats.gallery</span></strong>
        strives to be that friendly guide.
      </p>
    </div>
    <div class="prose prose-xl">
      <h2>the <span class="text-pink-500">guide</span></h2>
      <p>
        I work in tech all day, and I understand it can get a
        <em>little</em> tiring for everything to be so&hellip;
        <em>technical</em> all the time. That's why
        <strong><span class="text-purple-500">stats.gallery</span></strong>
        tries to ease that burden a little bit by adding some color back into
        the equation.
      </p>
      <p>
        When you explore an account, you'll see a few base metrics about the
        account's activity: How much gas has been spent? How long has the
        account existed?
      </p>
      <p>
        Take a look at the Badges page to see some goals to work towards.
        Receive an NFT or deploy a smart contract and you'll be rewarded with a
        shiny badge below your name. Stay active to see your score and level
        grow!
      </p>
      <p>
        You'll also find some useful charts and graphs, as well as a
        comprehensive and easy-to-digest list of transactions.
      </p>
      <p>
        All of this is wrapped up in one nice, tidy, and beautiful package: your
        <strong><span class="text-purple-500">stats.gallery</span></strong
        >.
      </p>
    </div>
    <div class="prose prose-xl">
      <h2>the <span class="text-yellow-500">future</span></h2>
      <p>
        There's a lot we have planned for this project, which you can explore in
        the project roadmap below. If you see something you'd like to help with
        or if you think something's missing, give us a holler!
      </p>
    </div>
    <div
      class="
        flex flex-col
        md:flex-row
        justify-around
        space-y-5
        md:space-y-0 md:space-x-5
      "
    >
      <div class="flex-1 flex flex-col space-y-3">
        <h3 class="text-center font-bold text-2xl">Done</h3>
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
        <h3 class="text-center font-bold text-2xl">Doing</h3>
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
        <h3 class="text-center font-bold text-2xl">To Do</h3>
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
    <div class="prose prose-xl">
      <h2>the <span class="text-green-600">team</span></h2>
    </div>
    <div class="flex flex-col md:flex-row items-start">
      <TeamMemberCard name="Jacob Lindahl (USA)" title="PO, senior developer">
        <template #image>
          <img src="./story/JacobFrame.svg" class="transform scale-75" />
        </template>
        <template #default>
          With over a decade of programming experience, Jacob has worked with
          everything from web applications to CAD software, and currently spends
          his time writing code to support Web 3 ecosystems. When he's not
          working, you can find him reading, ballroom dancing, or hiking in the
          Tetons.
        </template>
        <template #quote>
          If you need a full-stack developer for your new DeFi project, I'm your
          man!
        </template>
        <template #contact>
          <external-link href="https://github.com/encody">
            <ContactGithubIcon class="w-9 text-indigo-900" />
          </external-link>
          <external-link href="https://t.me/encody">
            <ContactTelegramIcon class="w-9" style="color: #039be5" />
          </external-link>
          <external-link href="mailto:jacob@near.org">
            <ContactEmailIcon class="w-9 text-green-500" />
          </external-link>
        </template>
      </TeamMemberCard>
      <TeamMemberCard name="Dan Podkovko (RU)" title="UX/UI designer">
        <template #image>
          <img src="./story/DanFrame.svg" class="transform scale-75" />
        </template>
        <template #default>
          Dan is a web, graphic, and UX/UI designer with 13 years of experience
          in these fields. Besides, he used to work as a marketing director on a
          civil weapons manufacturer, was a product manager, and ran several own
          e-commerce projects. Currently, working on his own psychological
          assessment service as a pet project. Loves entrepreneurship, music,
          psychology, and design.
        </template>
        <template #quote>
          I would be happy to assist you with UX/UI design for your dApps, smart
          contracts, and DAOs, as well as web design for your websites and
          landing pages! Feel free to reach me
          <span class="not-italic">&#x1F447;</span>
        </template>
        <template #contact>
          <external-link href="https://t.me/danpodkovko">
            <ContactTelegramIcon class="w-9" style="color: #039be5" />
          </external-link>
          <external-link href="mailto:danpodkovko@gmail.com">
            <ContactEmailIcon class="w-9 text-green-500" />
          </external-link>
        </template>
      </TeamMemberCard>
    </div>
    <hr />
    <div class="py-36 space-y-6 flex flex-col items-center">
      <h2 class="text-2xl font-bold text-center">
        Want to create projects with NEAR?
      </h2>
      <h1 class="text-3xl font-bold text-center">We're hiring!</h1>
      <p class="text-xl text-center">
        NEAR is growing and we're looking for talent who wants to work with the
        future, today. If you are a <strong>developer</strong>,
        <strong>creator</strong>, <strong>entrepreneur</strong>, or
        <strong>educator</strong>, apply today! Let's make great things
        together!
      </p>
      <external-link
        href="https://near.org/careers/"
        class="
          px-8
          py-3
          font-medium
          text-xl
          whitespace-nowrap
          text-white
          bg-green-600
          hover:bg-green-700
          rounded-sm
          shadow
          inline-flex
          items-center
        "
      >
        <span>Apply now</span>
      </external-link>
    </div>
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

.prose h2 {
  @apply mt-24;
}

.prose a {
  @apply dark:text-white;
}
</style>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import ContactEmailIcon from '@/components/icons/ContactEmailIcon.vue';
import ContactGithubIcon from '@/components/icons/ContactGithubIcon.vue';
import ContactTelegramIcon from '@/components/icons/ContactTelegramIcon.vue';
import TopBar from '@/components/navigation/TopBar.vue';
import { DateTime } from 'luxon';
import { defineComponent } from 'vue';
import RoadmapCard from './story/RoadmapCard.vue';
import { RoadmapTask, tasks } from './story/tasks';
import TeamMemberCard from './story/TeamMemberCard.vue';

export default defineComponent({
  components: {
    TopBar,
    Footer,
    RoadmapCard,
    TeamMemberCard,
    ContactGithubIcon,
    ContactEmailIcon,
    ContactTelegramIcon,
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
