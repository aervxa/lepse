<script setup>
import { Lightbulb, LightbulbOff } from 'lucide-vue-next'

definePageMeta({
  layout: 'shell',
})

const inFocus = ref(false)
</script>

<template>
  <!-- TODO: Focus should be here    -->
  <!-- Header | logo -->
  <div class="flex items-center justify-between gap-8">
    <Logo class="h-10 sm:h-12" />
    <FocusSessions />
  </div>

  <!-- Center | clock -->
  <div class="mx-auto my-auto pb-[16vh]">
    <Clock />
  </div>

  <!-- Footer | actions -->
  <div class="flex items-center justify-between gap-8">
    <div>
      <BubbleNav />
    </div>

    <Button
      :variant="inFocus ? 'secondary' : 'default'"
      class="font-mono text-[11px] tracking-widest uppercase"
      @click="inFocus = !inFocus"
    >
      <LightbulbOff v-if="inFocus" />
      <Lightbulb v-else />
      {{ inFocus ? 'Exit' : 'Focus' }}
    </Button>
  </div>
</template>
