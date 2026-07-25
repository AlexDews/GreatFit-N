// app/components/scroll/config.ts
/**
 ** LuminaNexus ModuX Scroll & Header Configuration
 * Все настройки плавного скролла и динамического поведения шапки сайта.
 */

export type HeaderAnimationType = "slide" | "fade";

export const scrollConfig = {
  goto: {
    offsetTop: 0,
    speed: 1000,
    noHeader: false,
  },
  header: {
    // Точка, после которой шапка фиксируется/прячется
    startPoint: 950,
    // Конечная точка (например, если на каком-то экране или внизу страницы нужно совсем скрыть/заблокировать)
    endPoint: 949,
    // true — показывать шапку ТОЛЬКО при скролле вверх. false — шапка всегда видна после startPoint
    onlyScrollUp: true as boolean,
    // Тип появления: 'slide' (выпад сверху через transform) или 'fade' (плавное появление через opacity)
    animationType: "slide" as HeaderAnimationType,
  },
  selectors: {
    header: "header.header",
    menuOpenClass: "menu-open",
    burgerBtn: ".burger",
  },
};
