<template>
  <div class="flex flex-col">
    <dt class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-400">
      <slot name="name"></slot>
    </dt>
    <dd class="order-1 text-5xl font-extrabold text-gray-800">
      <slot name="value"></slot>
    </dd>
  </div>
</template>
