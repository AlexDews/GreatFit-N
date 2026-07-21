<!-- app\components\TheHeader.vue -->
<script setup lang="ts">
import { gsap } from "gsap";

const isOpen = ref<string | null>(null);
const submenuRefs = ref<Record<string, HTMLUListElement | null>>({});
const setSubmenuRef = (el: Element | ComponentPublicInstance | null, key: string) => {
  if (el) {
    if (typeof el === "object" && "$el" in el) {
      submenuRefs.value[key] = (el as ComponentPublicInstance).$el as HTMLUListElement;
    } else {
      submenuRefs.value[key] = el as HTMLUListElement;
    }
  }
};

const handleToggle = (e: MouseEvent, menuName: string) => {
  if (window.innerWidth <= 991.98) {
    e.preventDefault();
    isOpen.value = isOpen.value === menuName ? null : menuName;
  }
};
const handleMouseEnter = (menuName: string) => {
  if (window.innerWidth > 991.98) {
    isOpen.value = menuName;
  }
};
const handleMouseLeave = () => {
  if (window.innerWidth > 991.98) {
    isOpen.value = null;
  }
};

type DropDownVars = gsap.TweenVars;
const dropDownOpen: DropDownVars = {
  height: "auto",
  opacity: 1,
  duration: 0.5,
  ease: "power2.out",
  overflow: "hidden",
  overwrite: "auto",
};
const dropDownClose: DropDownVars = {
  height: 0,
  opacity: 0,
  duration: 0.25,
  ease: "power2.in",
  overflow: "hidden",
  overwrite: "auto",
};
watch(isOpen, (newMenu, oldMenu) => {
  if (oldMenu) {
    const oldItem = submenuRefs.value[oldMenu];
    if (oldItem) {
      gsap.killTweensOf(oldItem);
      gsap.to(oldItem, dropDownClose);
    }
  }
  if (newMenu) {
    const newItem = submenuRefs.value[newMenu];
    if (newItem) {
      gsap.killTweensOf(newItem);
      gsap.to(newItem, dropDownOpen);
    }
  }
});
</script>

<template>
  <ScrollHeader v-slot="{ isFixed, isShow, isAnimating }">
    <header
      data-lp
      class="header"
      :class="{
        '_is-fixed': isFixed,
        '_is-animating': isAnimating,
        '_is-show': isShow,
      }"
    >
      <div class="header__container">
        <div class="header__wrapper">
          <div class="logo header__logo">
            <RouterLink
              to="/"
              class="logo__link"
            >
              <img
                src="/images/logo/logo.svg"
                alt="Логотип Название"
              />
              <div class="logo__text">
                <strong>
                  Great
                  <span class="logo__accent">Fit</span>
                </strong>
                <span class="logo__subtext">Yoga Studio</span>
              </div>
            </RouterLink>
          </div>

          <nav class="header__nav nav">
            <ul class="nav__menu">
              <li class="nav__item">
                <NuxtLink
                  to="/"
                  class="nav__link"
                >
                  Home
                </NuxtLink>
              </li>
              <li
                class="nav__item nav__item--submenu nav__item--services"
                :class="{ 'is-open': isOpen === 'services' }"
                @mouseenter="handleMouseEnter('services')"
                @mouseleave="handleMouseLeave"
              >
                <NuxtLink
                  to="/services"
                  class="nav__link"
                  @click="handleToggle($event, 'services')"
                >
                  Services
                  <svgo-arrow-nav class="nav__icon" />
                </NuxtLink>
                <ul
                  :ref="(el) => setSubmenuRef(el, 'services')"
                  class="nav__submenu"
                >
                  <li class="nav__subitem">
                    <NuxtLink
                      to="/"
                      class="nav__sublink"
                    >
                      Spa Area
                    </NuxtLink>
                  </li>
                  <li class="nav__subitem">
                    <NuxtLink
                      to="/"
                      class="nav__sublink"
                    >
                      Changing Room
                    </NuxtLink>
                  </li>
                  <li class="nav__subitem">
                    <NuxtLink
                      to="/"
                      class="nav__sublink"
                    >
                      Free Lessons
                    </NuxtLink>
                  </li>
                  <li class="nav__subitem">
                    <NuxtLink
                      to="/"
                      class="nav__sublink"
                    >
                      Free Rug
                    </NuxtLink>
                  </li>
                </ul>
              </li>
              <li
                class="nav__item nav__item--submenu nav__item--facility"
                :class="{ 'is-open': isOpen === 'facility' }"
                @mouseenter="handleMouseEnter('facility')"
                @mouseleave="handleMouseLeave"
              >
                <NuxtLink
                  to="/facility"
                  class="nav__link"
                  @click="handleToggle($event, 'facility')"
                >
                  Our Facility
                  <svgo-arrow-nav class="nav__icon" />
                </NuxtLink>
                <ul
                  :ref="(el) => setSubmenuRef(el, 'facility')"
                  class="nav__submenu"
                >
                  <li class="nav__subitem">
                    <NuxtLink
                      to="/"
                      class="nav__sublink"
                    >
                      Beginners Yoga
                    </NuxtLink>
                  </li>
                  <li class="nav__subitem">
                    <NuxtLink
                      to="/"
                      class="nav__sublink"
                    >
                      Stretching
                    </NuxtLink>
                  </li>
                  <li class="nav__subitem">
                    <NuxtLink
                      to="/"
                      class="nav__sublink"
                    >
                      Fly-Yoga
                    </NuxtLink>
                  </li>
                </ul>
              </li>
              <li class="nav__item">
                <NuxtLink
                  to="/about"
                  class="nav__link"
                >
                  About
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink
                  to="/contact"
                  class="nav__link"
                >
                  Contact
                </NuxtLink>
              </li>
            </ul>
          </nav>
          <div class="header__burger">
            <AppMobileMenu />
          </div>
          <AppButton
            to="/"
            class="header__btn"
          >
            <svgo-cart class="header__cart" />
            <span>Shop Now</span>
          </AppButton>
        </div>
      </div>
    </header>
  </ScrollHeader>
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 150;
  background-color: transparent;
  transform: translateY(0);

  // РЕЖИМ ФИКСАЦИИ
  &._is-fixed {
    position: fixed;
    background-color: rgb(255 255 255 / 70%);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgb(0 0 0 / 5%);
    transform: translateY(-100%);

    .header__wrapper {
      padding: 20px 0;
    }
  }

  // РАЗРЕШЕНИЕ АНИМАЦИИ
  &._is-animating {
    transition:
      transform 0.4s ease,
      background-color 0.3s ease;
  }

  // ВЫЕЗД ШАПКИ
  &._is-show {
    transform: translateY(0);
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    transition: padding 0.3s ease;
    position: relative;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__nav {
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    &--mail {
      background-color: transparent;
      border: 2px solid $fontMainColor;
      color: $fontMainColor;

      @media (any-hover: hover) {
        &:hover {
          color: #fff;
        }
      }
    }
  }

  &__cart {
    width: 15px;
    height: 16px;
  }
  &__burger {
  }
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;

  &__link {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      margin-right: 5px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: end;
    font-family: Montserrat, sans-serif;
    strong {
      font-size: 24px;
      font-weight: 700;
    }
  }

  &__accent {
    font-size: 24px;
    color: $colorAccent;
    font-weight: 700;
  }

  &__subtext {
    display: flex;
    font-size: 12px;
    font-weight: 500;
    margin-top: -5px;
  }
}

.nav {
  &__menu {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
  }
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

@media (max-width: $tablet) {
  .header__nav,
  .header__btn {
    display: none;
  }
}
</style>
