import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        class: 'dark',
      },
      meta: [{ name: 'apple-mobile-web-app-title', content: 'Lepse' }],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  // Enables the development server to be discoverable by other devices when running on iOS physical devices
  devServer: {
    host: '0.0.0.0',
  },
  devtools: { enabled: true },
  fonts: {
    defaults: {
      weights: ['100 900'],
      styles: ['normal', 'italic'],
    },
    families: [{ name: 'Outfit' }, { name: 'DM Mono' }],
  },
  // Avoids error [unhandledRejection] EMFILE: too many open files, watch
  ignore: ['**/src-tauri/**'],
  imports: {
    dirs: ['~/composables/**'],
  },
  modules: ['@nuxt/fonts', 'motion-v/nuxt', 'shadcn-nuxt', 'vue-sonner/nuxt'],
  routeRules: {
    '/': { redirect: '/shell' },
    '/shell/settings': { redirect: '/shell/settings/account' },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3333',
    },
  },
  shadcn: {
    prefix: '',
  },
  // Enable SSG
  ssr: false,
  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,
    // Enable environment variables
    // Additional environment variables can be found at
    // https://v2.tauri.app/reference/environment-variables/
    envPrefix: ['VITE_', 'TAURI_'],
    optimizeDeps: {
      include: [
        '@internationalized/date',
        '@tauri-apps/api/core',
        '@tauri-apps/api/webviewWindow',
        '@tauri-apps/plugin-os',
        '@tauri-apps/plugin-store',
        '@tuyau/core/client',
        '@vee-validate/zod',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vueuse/core',
        'class-variance-authority',
        'clsx',
        'lucide-vue-next',
        'reka-ui',
        'reka-ui/date',
        'tailwind-merge',
        'vaul-vue',
        'vee-validate',
        'zod',
      ],
    },
    plugins: [tailwindcss()],
    server: {
      // Tauri requires a consistent port
      strictPort: true,
    },
  },
})
