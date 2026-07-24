// composables/useMenu.ts
import { menuItems } from "~/data/menu";

export const useMenu = () => {
  return {
    menuItems: ref(menuItems),
    error: ref(null),
    refresh: () => {
      console.log("Refresh menu from Strapi");
    },
  };
};
