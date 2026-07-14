// app/composables/system.config.ts

export const systemConfig = {
  // --- Управление скроллом и меню ---
  bodyLock: {
    delay: 300,
    paddingAttr: "[data-lp]",
    lockClass: "_lock",
  },

  // --- Системный детект девайсов ---
  deviceDetection: {
    android: /Android/i as RegExp,
    blackBerry: /BlackBerry/i as RegExp,
    iOS: /iPhone|iPad|iPod/i as RegExp,
    opera: /Opera Mini/i as RegExp,
    windows: /IEMobile/i as RegExp,
  },

  // --- Системные плагины и фичи ---
  features: {
    imaskEnabled: true as boolean, // Вынесли сюда глобальный тумблер масок
  },

  // --- Глобальная безопасность проекта (Перенесено) ---
  security: {
    enableSanitization: true as boolean,
    sanitizationLevel: "standard" as string,
    maxFileSize: 10485760 as number, // 10MB
    xssPatterns: [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /javascript:/gi, /onerror/gi, /onclick/gi] as RegExp[],
    allowedFileTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ] as string[],
  },

  // --- Поддержка форматов картинок браузером ---
  imageSupport: {
    webp: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA" as string,
    avif: "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgMAQUFBG21ldGEAAAAAAAAAFGgkbHRyAAAAE21pZGYAAAAAAAABAAAAFGlwcnAAAAEnaW1jbyAAAAAUYXV4dgAAAAE0eG1sAAAAABVpcG1hAAAAAAAAAAEAAQGgGGloY28AAAAVYXYwMQGAQGgK/v//gAAAABVpc3BlAAAAAAAAAAIAAAACAAAAFHBpeGkAAAAAAwEBAQAAAAxidXJ0AAAAAAAAACV0cmFmAAAAFHRmYWQAAAAAAAABAAAAAQAAAAFtZGF0" as string,
  },
};
