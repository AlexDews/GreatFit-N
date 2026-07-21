// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // 1. Системные настройки Nuxt
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // 2. Модули (Официальные и сторонние)
  modules: ["@nuxt/image", "@nuxt/fonts", "@nuxt/eslint", "nuxt-svgo"],

  // 3. Мета-данные приложения и Фавиконки
  app: {
    head: {
      title: "Great Fit Yoga Studio",
      meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { name: "theme-color", content: "#1e3d2f" }],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicons/favicon.ico?v=1" },
        { rel: "icon", type: "image/svg+xml", href: "/favicons/favicon.svg?v=1" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicons/apple-touch-icon.png?v=1" },
      ],
    },
  },

  // 4. Шрифты (@nuxt/fonts)
  fonts: {
    families: [
      { name: "Montserrat", weights: [300, 400, 500, 600, 700] },
      { name: "Inter", weights: [300, 400, 500, 600, 700] },
    ],
  },

  // 5. Глобальные стили проекта
  css: ["@/assets/scss/style.scss"],

  // 6. Сборщик Vite и SCSS-переменные
  vite: {
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["import"],
          additionalData: `
            @use "sass:math" as math;
            @import "@/assets/scss/utils/settings.scss";
            @import "@/assets/scss/utils/mixins.scss";
          `,
        },
      },
    },
  },

  // 7. Пост-процессинг CSS (Префиксы, PX в REM, Сортировка медиа)
  postcss: {
    plugins: {
      "postcss-sort-media-queries": {},
      "postcss-pxtorem": {
        rootValue: 16, // 1rem = 16px
        propList: ["*"], // Конвертируем все свойства
        selectorBlackList: [], // Селекторы, которые не трогаем
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,
      },
      autoprefixer: {},
    },
  },

  // 8. Автоимпорт компонентов
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      extensions: ["vue"],
      pattern: "**/*.vue", // Рекурсивный поиск во вложенных папках
    },
  ],

  // 9. Настройки сторонних плагинов
  svgo: {
    autoImportPath: "./assets/icons/",
    svgoConfig: {
      plugins: [
        "preset-default",
        {
          name: "convertShapeToPath",
          params: {},
        },
        {
          name: "removeAttrs",
          params: {
            attrs: "(fill-rule|clip-rule)",
          },
        },
      ],
    },
  },

  // 10. Тонкие настройки Nuxt (Features)
  features: {
    inlineStyles: false, // Отключает генерацию встроенных <style> тегов в HTML
  },
});
