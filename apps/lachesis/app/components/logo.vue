<script setup lang="ts">
import { ArrowUpRight, Download, Info } from '@lucide/vue'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="-m-2 p-2">
      <div
        class="max-2xs:hidden bg-foreground-fixed fixed-color-clock:bg-foreground aspect-6/2 h-8 mask-[url('/logo.png')] mask-contain mask-no-repeat brightness-75 sm:h-10"
      ></div>
      <div
        class="2xs:hidden bg-foreground-fixed fixed-color-clock:bg-foreground size-10 mask-[url('/favicon-96x96.png')] mask-contain mask-no-repeat brightness-75"
      ></div>
    </ContextMenuTrigger>

    <ContextMenuContent>
      <!-- TODO: Link actual homepage -->
      <ContextMenuItem disabled>
        <ArrowUpRight />
        Open homepage in new tab
      </ContextMenuItem>
      <ContextMenuItem as-child>
        <a href="https://os.lepse.app/logo.png" target="_blank">
          <Download />
          Download logo
        </a>
      </ContextMenuItem>
      <ContextMenuItem as-child>
        <a href="https://os.lepse.app/favicon-96x96.png" target="_blank">
          <Download />
          Download favicon
        </a>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <!-- TODO: Link actual about page -->
      <ContextMenuItem disabled>
        <Info />
        About
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
