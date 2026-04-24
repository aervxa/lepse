<template>
  <div class="flex items-center justify-between rounded-xl border p-2 hover:bg-muted/50">
    <div class="flex items-center gap-2">
      <!-- Priority -->
      <Skeleton class="size-4 m-2" />
      <Separator orientation="vertical" />
      <!-- Status -->
      <Skeleton class="size-4 m-2" />
      <!-- Name -->
      <Skeleton class="h-4 w-32" />
    </div>

    <!-- Additional info -->
    <div class="flex items-center justify-end min-w-0 gap-3 px-4">
      <div class="flex items-center gap-1.5">
        <Skeleton class="size-3" />
        <Skeleton class="h-3 w-12" />
      </div>
      <div class="flex items-center gap-1.5">
        <Skeleton class="size-3" />
        <Skeleton class="h-3 w-14" />
      </div>
      <Separator orientation="vertical" />
      <Skeleton class="h-3 w-10" />
    </div>
  </div>
</template>
