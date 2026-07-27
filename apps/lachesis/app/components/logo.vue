<script setup lang="ts">
import { ArrowUpRight, Download, Info } from '@lucide/vue'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="-m-2 p-2">
      <img src="/logo.png" class="pointer-events-none h-10 not-dark:invert sm:h-12" />
    </ContextMenuTrigger>

    <ContextMenuContent>
      <!-- TODO: Link actual homepage -->
      <ContextMenuItem>
        <ArrowUpRight />
        Open homepage in new tab
      </ContextMenuItem>
      <ContextMenuItem as-child>
        <a href="/logo.png" target="_blank">
          <Download />
          Download logo
        </a>
      </ContextMenuItem>
      <ContextMenuItem as-child>
        <a href="/favicon-96x96.png" target="_blank">
          <Download />
          Download favicon
        </a>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <!-- TODO: Link actual about page -->
      <ContextMenuItem>
        <Info />
        About
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
