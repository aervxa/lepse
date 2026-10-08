<script setup lang="ts">
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
]
</script>

<template>
  <main class="bg-sidebar flex h-dvh flex-col">
    <!-- Navbar -->
    <nav class="mx-auto grid h-12 w-full max-w-6xl grid-cols-3 items-center px-4">
      <a href="/" class="flex items-center gap-2 select-none">
        <img src="/logo.svg" class="h-6" />
      </a>

      <div class="flex place-content-center gap-2">
        <NuxtLink
          v-slot="{ href, navigate, prefetch, shouldPrefetch, isExactActive }"
          v-for="i in navItems"
          :key="i.label"
          :to="i.href"
          custom
        >
          <Button
            :variant="isExactActive ? 'default' : 'link'"
            :class="{
              'bg-primary/20 hover:bg-primary/30 text-primary saturate-150 hover:brightness-110':
                isExactActive,
            }"
            size="sm"
            as-child
          >
            <a
              :href="href || ''"
              @click="navigate"
              @pointerenter="shouldPrefetch('interaction') && prefetch()"
              @focus="shouldPrefetch('interaction') && prefetch()"
            >
              {{ i.label }}
            </a>
          </Button>
        </NuxtLink>
      </div>

      <!-- TODO: Mobile breakpoint -->
      <!-- Action -->
      <div class="flex place-content-end gap-2">
        <Button size="sm">
          <a href="/web">Open Lepse</a>
        </Button>
      </div>
    </nav>

    <!-- Shell -->
    <section
      class="bg-background outline-border/50 relative z-0 m-2 mt-0 flex flex-1 flex-col overflow-auto rounded-lg outline-2"
    >
      <NuxtPage />
    </section>
  </main>
</template>
