<template>
  <div class="sm:w-1/2 flex py-4 px-1">
    <div
      class="
        rounded-md
        shadow-md
        bg-white
        dark:bg-gray-800
        w-full
        p-6
        text-center
        prose prose-xl
        card-content
      "
    >
      <slot />
    </div>
  </div>
</template>

<style>
.card-content,
.card-content h1,
.card-content h2,
.card-content h3,
.card-content h4 {
  @apply dark:text-white !important;
}
</style>
