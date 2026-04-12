<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number
    class?: string
  }>(),
  {
    size: 24,
    class: '',
  }
)

const isDark = ref(true)

function changeTheme(theme: 'light' | 'dark') {
  isDark.value = theme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

async function toggleTheme(event: MouseEvent) {
  const next = isDark.value ? 'light' : 'dark'
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  if (!document.startViewTransition) {
    changeTheme(next)
    return
  }

  const transition = document.startViewTransition(() => changeTheme(next))
  await transition.ready

  document.documentElement.animate(
    {
      clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`],
    },
    {
      duration: 300,
      easing: 'ease-out',
      pseudoElement: '::view-transition-new(root)',
    }
  )
}

onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
  changeTheme(stored ?? (mediaQuery.matches ? 'dark' : 'light'))

  // Keep in sync with system changes only when no stored preference
  const onSystemChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) changeTheme(e.matches ? 'dark' : 'light')
  }
  mediaQuery.addEventListener('change', onSystemChange)
  onUnmounted(() => mediaQuery.removeEventListener('change', onSystemChange))
})
</script>

<template>
  <button
    aria-label="Toggle theme"
    :class="props.class"
    class="cursor-pointer focus:outline-none"
    @click="toggleTheme"
  >
    <svg
      :width="props.size"
      :height="props.size"
      viewBox="0 0 24 24"
      class="text-current transition-none **:origin-center **:[stroke-linecap:round]"
    >
      <mask id="moon-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <circle
          :class="
            isDark ? '-translate-x-1.75 delay-300 duration-500' : 'translate-x-0 duration-300'
          "
          class="transition-transform ease-in-out"
          cx="24"
          cy="10"
          r="6"
          fill="black"
        />
      </mask>

      <circle
        :class="isDark ? 'scale-[1.75] duration-300' : 'scale-100 duration-500'"
        class="transition-transform ease-in-out"
        cx="12"
        cy="12"
        r="6"
        mask="url(#moon-mask)"
        fill="currentColor"
      />

      <g
        :class="isDark ? '-rotate-45 opacity-0 duration-150' : 'rotate-0 opacity-100 duration-500'"
        class="stroke-2 transition-[transform,opacity] ease-in-out"
        stroke="currentColor"
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  </button>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
</style>
