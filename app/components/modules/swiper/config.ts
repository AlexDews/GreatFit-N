// app/components/modules/swiper/config.ts

/**
 ** LuminaNexus ModuX Swiper Configuration
 */

import type { SwiperOptions } from "swiper/types";

interface SwiperModuleConfig {
  defaults: SwiperOptions & {
    autoplay: {
      delay: number;
      disableOnInteraction: boolean;
    };
  };
  controls: {
    enabled: boolean;
    disableOnDesktop: boolean;
    desktopBreakpoint: number;
  };
}

export const swiperConfig: SwiperModuleConfig = {
  //~ Настройки слайдера по умолчанию
  defaults: {
    loop: true as boolean, // Бесконечное зацикливание слайдов
    speed: 500 as number, // Скорость переключения (мс)
    slidesPerView: 1 as number, // Количество видимых слайдов
    spaceBetween: 30 as number, // Отступ между слайдами (px)
    autoplay: {
      delay: 3000 as number, // Задержка автопрокрутки (мс)
      disableOnInteraction: false as boolean, // Не отключать автопрокрутку при ручном листании
    },
    observer: true as boolean, // Обновлять swiper при изменении DOM-структуры
    observeParents: true as boolean, // Обновлять swiper при изменении родительских элементов
    watchSlidesProgress: true as boolean, // Отслеживать прогресс отображения слайдов
    resizeObserver: true as boolean, // Следить за изменением размеров контейнера
  },

  //~ Управление инициализацией и адаптивностью
  controls: {
    enabled: true as boolean, // Глобальный переключатель (true — слайдер работает, false — полностью выключен)
    disableOnDesktop: false as boolean, // true — отключать слайдер на десктопе и выстраивать карточки в обычную сетку
    desktopBreakpoint: 992 as number, // Разрешение (px), выше которого слайдер уничтожается (если disableOnDesktop: true)
  },
};
