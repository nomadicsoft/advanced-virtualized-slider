// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      meta: [
        {
          name: "viewport",
          content:
              "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no",
        },
      ],
    },
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  ssr: true,
  alias: {
    assets: "/<rootDir>/assets",
  },
  css: ["~/assets/scss/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/variables.scss";',
        },
      },
    },
  },
  modules: ["@nuxtjs/color-mode"],
});
