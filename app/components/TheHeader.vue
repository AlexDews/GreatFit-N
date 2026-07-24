<!-- app\components\TheHeader.vue -->
<script setup lang="ts"></script>

<template>
  <ScrollHeader v-slot="{ isFixed, isShow, isAnimating }">
    <header
      ref="headerElement"
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
          <Animated
            type="fade-right"
            :delay="0.2"
            :trigger="false"
            class="logo header__logo"
          >
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
          </Animated>

          <nav class="header__nav nav">
            <TheNavigation />
          </nav>
          <div class="header__burger">
            <AppMobileMenu />
          </div>
          <Animated
            type="fade-left"
            :delay="1.2"
            :trigger="false"
          >
            <AppButton
              to="/"
              class="header__btn"
            >
              <svgo-cart class="header__cart" />
              <span>Shop Now</span>
            </AppButton>
          </Animated>
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

    .header__wrapper {
      padding: 20px 0;
    }
  }

  // ВКЛЮЧЕНИЕ ТРАНЗИШЕНА (работает, когда есть _is-animating)
  &._is-animating {
    transition:
      transform 0.4s ease,
      background-color 0.3s ease;
  }

  // ВЫЕЗД И СКРЫТИЕ
  &._is-fixed:not(._is-show) {
    transform: translateY(-100%);
  }

  &._is-fixed._is-show {
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

@media (max-width: $tablet) {
  .header__nav,
  .header__btn {
    display: none;
  }
}
</style>
