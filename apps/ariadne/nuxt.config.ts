import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        class: 'dark',
      },
    },
  },
  compatibilityDate: '2025-07-15',
  components: [{ path: '~/components/ui', extensions: ['.vue'] }],
  css: ['./app/assets/css/main.css'],
  devtools: { enabled: true },
  fonts: {
    defaults: {
      weights: ['100 900'],
      styles: ['normal', 'italic'],
    },
    families: [{ name: 'Outfit' }, { name: 'DM Mono' }],
  },
  modules: ['vue-sonner/nuxt', '@nuxt/fonts'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3333',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
