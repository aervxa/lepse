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
  css: ['./app/assets/css/main.css'],
  devtools: { enabled: true },
  fonts: {
    defaults: {
      weights: ['100 900'],
      styles: ['normal', 'italic'],
    },
    families: [{ name: 'Outfit' }, { name: 'DM Mono' }],
  },
  modules: ['@nuxt/fonts', 'shadcn-nuxt', 'vue-sonner/nuxt'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3333',
    },
  },
  shadcn: {
    prefix: '',
  },
  ssr: false,
  vite: {
    optimizeDeps: {
      include: [
        'vee-validate',
        'zod',
        '@vee-validate/zod',
        'reka-ui/date',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'clsx',
        'tailwind-merge',
        '@tuyau/core/client',
        'lucide-vue-next',
        'class-variance-authority',
        '@vueuse/core',
        'reka-ui',
        '@internationalized/date',
      ],
    },
    plugins: [tailwindcss()],
  },
})
