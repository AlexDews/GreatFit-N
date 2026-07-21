// app/composables/useGoToBlock.ts
import { useBurger } from "@/composables/useBurger";
import { useSmoothScroll } from "./useSmoothScroll";
import { scrollConfig } from "@/components/modules/scroll/config";

interface GoToBlockOptions {
  speed?: number;
  offsetTop?: number;
  noHeader?: boolean;
  closeMenu?: boolean;
}

export function useGoToBlock() {
  const { scrollTo } = useSmoothScroll();
  const { closeMenu, isMenuOpen } = useBurger();

  const goToBlock = (selector: string, options: GoToBlockOptions = {}) => {
    if (!import.meta.client) return;

    const target = document.querySelector(selector);

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const config = {
      ...scrollConfig.goto,
      closeMenu: true,
      ...options,
    };

    if (config.closeMenu && isMenuOpen.value) {
      closeMenu();
    }

    const header = config.noHeader ? null : document.querySelector(scrollConfig.selectors.header);

    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;

    scrollTo(target, {
      speed: config.speed,
      offsetTop: headerHeight + config.offsetTop,
    });
  };

  return {
    goToBlock,
  };
}
