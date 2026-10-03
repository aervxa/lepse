<template>
  <TooltipProvider>
    <slot />
  </TooltipProvider>
  <Toaster position="top-center" richColors class="font-[inherit]! **:pointer-events-auto" />
</template>
