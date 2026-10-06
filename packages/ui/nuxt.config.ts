import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

/**
 * NOTE: fileURLToPath is needed because these all are extended to the using application
 * and is needed to resolve the relative path correctly
 */

/**
 * IMPORTANT: CSS is not specified here, the app should import it for a better tailwind use.
 * otherwise, two intances of tailwindcss will run
 * `@import "@lepse/ui/app/assets/css/tailwind.css"`
 */

export default defineNuxtConfig({
  modules: ['shadcn-nuxt', 'vue-sonner/nuxt'],
  shadcn: {
    prefix: '',
    componentDir: fileURLToPath(new URL('./app/components/ui', import.meta.url)),
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
