<template>
  <!-- Remove page if nested is hard set to false -->
  <div
    v-bind="$attrs"
    v-if="useRoute().meta.nested !== false"
    class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 p-8"
  >
    <slot />
  </div>

  <!-- For modals or page replaces via meta.nmested -->
  <NuxtPage />
</template>
