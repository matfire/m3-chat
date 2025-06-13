import tailwindcss from "@tailwindcss/vite"

import env from "./lib/env"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: ''
  },
  runtimeConfig: {
    public: {
      pusherKey: env.PUSHER_KEY,
      pusherHost: env.PUSHER_HOST,
      pusherPort: env.PUSHER_PORT,
      pusherSecure: env.PUSHER_SECRET,
      pusherCluster: env.PUSHER_CLUSTER ?? "eu"
    }
  }
})