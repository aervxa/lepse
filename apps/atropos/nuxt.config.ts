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

    cloudflare: {
      deployConfig: false,
      nodeCompat: true,
    },
  },

  modules: ['@nuxtjs/color-mode', '@nuxtjs/device'],

  runtimeConfig: {
    public: {
      webUrl: process.env.NUXT_PUBLIC_WEB_URL || 'https://os.lepse.app',
    },
    githubToken: '',
  },
})
