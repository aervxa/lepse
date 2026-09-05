import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
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

  // Avoids error [unhandledRejection] EMFILE: too many open files, watch
  ignore: ['**/src-tauri/**'],

  imports: {
    dirs: ['~/composables/**'],
  },

  modules: ['motion-v/nuxt', 'shadcn-nuxt', 'vue-sonner/nuxt', 'nitro-cloudflare-dev'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://clotho.lepse.app',
    },
  },

  shadcn: {
    prefix: '',
  },

  // Enable CSR
  ssr: false,

  telemetry: false,

  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,
    // Enable environment variables
    // Additional environment variables can be found at
    // https://v2.tauri.app/reference/environment-variables/
    envPrefix: ['VITE_', 'TAURI_'],
    optimizeDeps: {
      include: [
        '@lucide/vue',
        '@tanstack/vue-form',
        '@tauri-apps/api/app',
        '@tauri-apps/api/core',
        '@tauri-apps/api/webviewWindow',
        '@tauri-apps/plugin-notification',
        '@tauri-apps/plugin-os',
        '@tauri-apps/plugin-process',
        '@tauri-apps/plugin-store',
        '@tauri-apps/plugin-updater',
        '@tuyau/core/client',
        '@tanstack/query-async-storage-persister',
        '@tanstack/query-persist-client-core',
        '@tanstack/vue-query',
        '@tuyau/vue-query',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vueuse/core',
        'change-case',
        'class-variance-authority',
        'clsx',
        'reka-ui',
        'tailwind-merge',
        'vaul-vue',
        'zod',
      ],
    },
    plugins: [tailwindcss()],
    server: {
      // Tauri requires a consistent port
      strictPort: true,
    },
  },

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: false,
      nodeCompat: true,
    },
  },
})
