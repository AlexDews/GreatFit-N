// app/components/modules/tabs/config.ts
/**
 ** LuminaNexus ModuX Tabs Configuration
 */
export const tabsConfig = {
  //~ --- Настройки анимации и классов ---
  speed: 300 as number,                 // Скорость JS-анимации развертывания
  activeClass: "_tab-active" as string, // Класс активного таба
  
  //~ --- Системные флаги ---
  useHash: true as boolean,             // Записывать ли выбранный таб в URL-хэш
  animate: true as boolean,             // Использовать ли плавную анимацию при смене табов
};