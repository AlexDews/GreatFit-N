// app/components/scroll/config.ts
/**
 ** LuminaNexus ModuX Scroll & Header Configuration
 * Все настройки плавного скролла и динамического поведения шапки сайта.
 */

export const scrollConfig = {
  goto: {
    offsetTop: 0,
    speed: 1000,
    noHeader: false,
  },
  header: {
    startPoint: 150,
  },
  selectors: {
    header: "header.header",
    menuOpenClass: "menu-open", 
    burgerBtn: ".burger",
  }
};