// composables/useStrapi.ts
import type { MenuItem } from "~/types/menu";
import type { ServicesItem } from "~/types/services";
import type { ClassesItem, ClassFeature } from "~/types/classes";
import type { TeamItem} from "~/types/team";

import { menuItems as fallbackMenu } from "~/data/menu";
import { servicesItem as fallbackServices } from "~/data/services";
import { classesItem as fallbackClasses } from "~/data/classes";
import { teamItem as fallbackTeam } from "~/data/team";

export type { ClassesItem, ClassFeature };

export const useMenu = () => {
  const { data, error, refresh } = useAsyncData<MenuItem[]>(
    "strapi-menu",
    async () => {
      try {
        const response = await $fetch<MenuItem[]>("/api/menu");
        return response || fallbackMenu;
      } catch {
        return fallbackMenu;
      }
    },
    {
      default: () => fallbackMenu,
    },
  );
  return {
    menuItems: computed(() => data.value ?? fallbackMenu),
    error,
    refresh,
  };
};

export const useServices = () => {
  const { data, error, refresh } = useAsyncData<ServicesItem[]>(
    "strapi-services",
    async () => {
      try {
        const response = await $fetch<ServicesItem[]>("/api/services");
        return response || fallbackServices;
      } catch {
        return fallbackServices;
      }
    },
    {
      default: () => fallbackServices,
    },
  );
  return {
    servicesItem: computed(() => data.value ?? fallbackServices),
    error,
    refresh,
  };
};

export const useClasses = () => {
  const { data, error, refresh } = useAsyncData<ClassesItem[]>(
    "strapi-classes",
    async () => {
      try {
        const response = await $fetch<ClassesItem[]>("/api/classes");
        return response || fallbackClasses;
      } catch {
        return fallbackClasses;
      }
    },
    {
      default: () => fallbackClasses,
    },
  );
  return {
    classesItem: computed(() => data.value ?? fallbackClasses),
    error,
    refresh,
  };
};
export const useTeam = () => {
  const { data, error, refresh } = useAsyncData<TeamItem[]>(
    "strapi-team",
    async () => {
      try {
        const response = await $fetch<TeamItem[]>("/api/classes");
        return response || fallbackTeam;
      } catch {
        return fallbackTeam;
      }
    },
    {
      default: () => fallbackTeam,
    },
  );
  return {
    teamItem: computed(() => data.value ?? fallbackTeam),
    error,
    refresh,
  };
};
