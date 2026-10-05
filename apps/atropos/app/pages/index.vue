<script setup lang="ts">
definePageMeta({
  layout: 'shell',
})
</script>

<template>
  <!-- Hero image -->
  <div
    class="pointer-events-none absolute -z-10 flex w-full flex-col saturate-150 select-none dark:brightness-75 [&_img]:h-224 [&_img]:object-cover"
  >
    <div class="contents *:mask-b-from-0%">
      <img src="/images/hero-dark.jpg" class="not-dark:hidden" />
      <img src="/images/hero-light.jpg" class="dark:hidden" />
    </div>
    <div class="contents *:rotate-180 *:mask-t-from-40% *:mask-t-to-60% *:mask-b-from-0%">
      <img src="/images/hero-dark.jpg" class="not-dark:hidden" />
      <img src="/images/hero-light.jpg" class="dark:hidden" />
    </div>
  </div>

  <!-- Content -->
  <div class="flex flex-col items-center-safe gap-8 p-6 pt-44 pb-96 md:pt-40 xl:pt-36">
    <Button variant="outline" size="xs" class="-mb-4">
      <span class="bg-primary mr-1 size-2 rounded-full" />
      What is Lepse?
    </Button>
    <p
      class="max-w-[15ch] text-center text-4xl leading-tight font-medium sm:text-5xl md:text-6xl lg:text-7xl"
    >
      Aesthetic productivity made easy
    </p>

    <!-- Dowload buttons -->
    <div class="flex flex-wrap justify-center gap-2">
      <!-- TODO: Platform -->
      <Button size="xl">Download Lepse</Button>
      <Button variant="outline" size="xl">Open in browser</Button>
    </div>
    <p class="text-muted-foreground mt-4 text-sm">Enjoy being productive once again.</p>

    <!-- TODO: make a 6.7% chance of the 67 version to load instead -->
    <img src="/images/app-homepage.webp" class="bg-accent w-full max-w-5xl rounded-xl border" />
  </div>
</template>
