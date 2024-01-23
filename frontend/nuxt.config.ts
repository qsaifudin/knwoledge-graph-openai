// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module"],
  runtimeConfig: { public: { BASE_URL: process.env.BASE_URL } },
  css: ["v-network-graph/lib/style.css"],
  build : {
    transpile: ['vue-toastification']
 },

  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark",
      },
      icons: {
        defaultSet: "mdi",
      },
    },
  },
});
