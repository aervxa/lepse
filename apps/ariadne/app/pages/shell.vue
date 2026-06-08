<script setup>
import { useWindowSize } from '@vueuse/core'
import { Lightbulb, LightbulbOff } from 'lucide-vue-next'
import { getDailyQuote } from '~/lib/quotes'

definePageMeta({
  layout: 'shell',
})

const { width } = useWindowSize()
const floatNav = computed(() => width.value >= 640)

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
      <BubbleNav :float="floatNav" />
      <p
        class="max-w-[28ch] text-pretty"
        :class="[
          floatNav
            ? 'text-xl font-medium opacity-80'
            : 'absolute bottom-[20vh] left-1/2 -translate-x-1/2 text-center text-lg font-light italic opacity-60',
        ]"
      >
        "{{ getDailyQuote() }}"
      </p>
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
