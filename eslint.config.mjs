// eslint.config.mjs
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier";

export default withNuxt([
  {
    // Папки-исключения (добавили служебные папки Nuxt)
    ignores: ["dist/**", "node_modules/**", "public/**", ".nuxt/**", ".output/**"],
  },
  {
    // Твои правила для JS и Vue
    files: ["**/*.js", "**/*.mjs", "**/*.vue"],
    rules: {
      "no-debugger": "warn",

      // В Nuxt эту проверку лучше отключить или настроить аккуратно,
      // так как автоимпорты он может посчитать за незадекларированные переменные
      "no-undef": "off",

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          args: "after-used",
        },
      ],

      // Твоя база — отключаем обязательные два слова в имени компонента
      "vue/multi-word-component-names": "off",
    },
  },
]).append(eslintConfigPrettier); // Отключаем конфликты форматирования с Prettier
