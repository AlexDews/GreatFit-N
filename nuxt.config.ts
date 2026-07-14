// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ["@nuxt/image", "@nuxt/fonts", "@nuxt/eslint"],

  css: ["@/assets/scss/style.scss"],

  postcss: {
    plugins: {
      "postcss-sort-media-queries": {},
      "postcss-pxtorem": {
        rootValue: 16, // Базовый размер шрифта (1rem = 16px)
        propList: ["*"], // Конвертировать все свойства (margin, padding, width...)
        selectorBlackList: [], // Что игнорировать (если нужно)
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,
      },
      autoprefixer: {},
    },
  },

  features: {
    inlineStyles: false, // Полностью отключает генерацию встроенных <style> тегов
  },

  vite: {
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["import"],
          additionalData: `
            @import "@/assets/scss/utils/settings.scss";
            @import "@/assets/scss/utils/mixins.scss";
          `,
        },
      },
    },
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
      extensions: ["vue"],
      // Это заставит Nuxt искать рекурсивно во всех вложенных папках
      pattern: "**/*.vue",
    },
  ],

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
});
