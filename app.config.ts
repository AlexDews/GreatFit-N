// app.config.ts
export default defineAppConfig({
  systemConfig: {
    //~ Настройки бургер-меню и блокировки скролла
    burger: {
      menuOpenClass: "menu-open",
      burgerBtn: ".burger-btn",
      lockClass: "lock",
      bodyLockDelay: 500,
      paddingAttr: "[data-lp]",
    },

    //~ Тестовые Base64 строки для проверки форматов картинок браузером
    imageSupport: {
      webp: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA",
      avif: "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAocGlmeAAAAAAAAAAYSWRhdGEAAAAAAAAAAwH/IAAAAAAAAAYAaWRhdAAAAAAAEBptZWRpYV90eXBlYXZpZg==",
    },

    //~ Регулярные выражения для определения мобильных платформ
    deviceDetection: {
      android: /Android/i,
      blackberry: /BlackBerry/i,
      ios: /iPhone|iPad|iPod/i,
      opera: /Opera Mini/i,
      windows: /IEMobile/i,
    },
  },
});
