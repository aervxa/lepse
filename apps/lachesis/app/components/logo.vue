<script setup lang="ts">
import { ArrowUpRight, Download, Info } from '@lucide/vue'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="-m-2 p-2">
      <div
        class="bg-foreground-fixed aspect-6/2 h-8 mask-[url('/logo.png')] mask-contain mask-no-repeat brightness-75 sm:h-10"
      ></div>
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
