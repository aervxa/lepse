<template>
  <main class="bg-sidebar flex h-dvh flex-col">
    <!-- Navbar -->
    <nav class="mx-auto grid h-12 w-full max-w-6xl grid-cols-3 items-center px-4">
      <a href="/" class="flex items-center gap-2 select-none">
        <img src="/favicon.svg" class="size-6" />
        <p class="text-xl font-medium">lepse</p>
      </a>

      <div class="flex place-content-center gap-2">
        <Button variant="link">
          <a href="/">Home</a>
        </Button>
        <Button variant="link">
          <a href="/">About</a>
        </Button>
        <Button variant="link">
          <a href="/">Contact us</a>
        </Button>
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
