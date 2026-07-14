// app/components/modules/popup/config.ts

interface PopupConfig {
  closeEsc: boolean;
  bodyLock: boolean;
  hashSettings: {
    location: boolean;
    goHash: boolean;
  };
  classes: {
    bodyActive: string;
  };
  on: {
    beforeOpen: (name: string) => void;
    afterOpen: (name: string) => void;
    beforeClose: (name: string) => void;
    afterClose: (name: string) => void;
  };
}

/**
 ** LuminaNexus ModuX Popups Configuration (Vue Edition)
 * Все глобальные настройки поведения окон и хуки жизненного цикла.
 */
export const popupConfig: PopupConfig = {
  //~ --- Доступность и управление ---
  // Закрывать попап при нажатии клавиши Escape (true/false)
  closeEsc: true as boolean,

  // Блокировать скролл страницы (body) при открытом попапе, чтобы контент не дергался
  bodyLock: true as boolean,

  //~ --- Настройки навигации (Hash в URL) ---
  hashSettings: {
    // Добавлять ли имя попапа в адресную строку (например, сайт.ру/#callback) при открытии
    location: true as boolean,
    // Открывать ли попап автоматически, если его имя указано в ссылке при загрузке страницы
    goHash: true as boolean,
  },

  //~ --- Системные классы ---
  classes: {
    // Класс, который добавляется к тегу <html> при открытом попапе (для кастомных стилей лока)
    bodyActive: "popup-show" as string,
  },

  //~ --- События (Хуки / Callbacks) ---
  // Позволяют выполнить любой код на разных этапах жизни попапа (например, очистить инпуты или стопнуть видео)
  on: {
    // Выполнится ПЕРЕД тем, как попап начнет открываться
    beforeOpen: (_name: string) => {
      // Пример: console.log(`Готовлюсь открыть попап: ${name}`);
    },
    // Выполнится ПОСЛЕ того, как попап полностью показался на экране
    afterOpen: (_name: string) => {
      // Пример: запустить проигрыватель видео, если он есть внутри попапа
    },
    // Выполнится СРАЗУ при нажатии на крестик или оверлей, перед закрытием
    beforeClose: (_name: string) => {
      // Пример: можно проверить, не заполнена ли форма, и выдать alert
    },
    // Выполнится ПОСЛЕ того, как попап полностью скрылся и анимация завершилась
    afterClose: (_name: string) => {
      // Пример: сбросить стейт формы в дефолтное состояние
    },
  },
};
