// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],

  devServer: {
    port: 4000,
  },

  devtools: { enabled: true },

  extends: ['@lepse/ui'],

  nitro: {
    preset: 'cloudflare_module',
  },

  modules: ['@nuxtjs/color-mode'],
})
