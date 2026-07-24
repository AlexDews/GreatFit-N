<!-- components/NavItem.vue -->
<script setup lang="ts">
import type { MenuItem } from "~/types/menu";
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    item: MenuItem;
    isSub?: boolean;
  }>(),
  {
    isSub: false,
  },
);

const hasChildren = computed(() => props.item.children && props.item.children.length > 0);
const isOpen = ref(false); // Локальный стейт. Всё!
const submenuRef = ref<HTMLUListElement | null>(null);

const linkAttrs = computed(() => ({
  to: props.item.href,
  ...(props.item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
}));

// GSAP анимация только при изменении локального флага
watch(isOpen, (val) => {
  if (!submenuRef.value || !import.meta.client) return;
  
  gsap.killTweensOf(submenuRef.value);
  
  if (val) {
    gsap.to(submenuRef.value, {
      height: "auto",
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  } else {
    gsap.to(submenuRef.value, {
      height: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      overwrite: "auto",
    });
  }
});

const handleMouseEnter = () => {
  if (import.meta.client && window.innerWidth > 991.98 && hasChildren.value) {
    isOpen.value = true;
  }
};

const handleMouseLeave = () => {
  if (import.meta.client && window.innerWidth > 991.98) {
    isOpen.value = false;
  }
};

const handleClick = (e: MouseEvent) => {
  // На мобильном просто инвертируем состояние при клике
  if (import.meta.client && window.innerWidth <= 991.98 && hasChildren.value) {
    e.preventDefault();
    isOpen.value = !isOpen.value;
  }
};
</script>

<template>
  <li
    :class="[isSub ? 'nav__subitem' : 'nav__item', { 'is-open': isOpen, 'nav__item--submenu': hasChildren }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <NuxtLink
      v-bind="linkAttrs"
      :class="isSub ? 'nav__sublink' : 'nav__link'"
      @click="handleClick"
    >
      {{ item.label }}
      <svgo-arrow-nav
        v-if="hasChildren"
        class="nav__icon"
      />
    </NuxtLink>

    <!-- Рекурсия: если есть дети, вызываем этот же компонент -->
    <ul
      v-if="hasChildren"
      ref="submenuRef"
      class="nav__submenu"
    >
      <NavItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :is-sub="true"
      />
    </ul>
  </li>
</template>

<style lang="scss" scoped>
.nav {
  &__item {
    gap: 15px;
    position: relative;
    display: inline-flex;
    &.is-open {
      .nav__icon {
        transform: rotate(180deg);
      }
    }
  }
  &__link {
    position: relative;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Inter, sans-serif;
    font-weight: 500;
    gap: 5px;
    padding: 3px 0;
    transition: color 0.3s ease 0s;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: $fontMainColor;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    @media (any-hover: hover) {
      &:hover {
        .nav__icon {
          transform: rotate(180deg);
        }
        &::after {
          transform: scaleX(1);
        }

        color: $fontMainColor;
      }
    }
  }

  &__icon {
    display: flex;
    transition: transform 0.3s ease;
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
  }

  // .nav__submenu
  &__submenu {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #f1efe5;
    border-radius: 0 4px 4px;
    min-width: 150px;
    height: 0;
    opacity: 0;
    overflow: hidden;
    z-index: 10;
  }

  // .nav__subitem
  &__subitem {
    display: flex;
    &:first-child {
      margin-top: 10px;
    }
    &:last-child {
      margin-bottom: 10px;
    }

    @media (any-hover: hover) {
      &:hover {
        background-color: #fff;
      }
    }
  }

  // .nav__sublink
  &__sublink {
    font-size: 14px;
    padding: 10px 20px;
  }
}
</style>
