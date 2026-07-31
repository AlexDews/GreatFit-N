<!-- app\components\home\HomeServices.vue -->
<script setup>
import AppSwiper from "@/components/modules/swiper/AppSlider.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppTitle from "@/components/ui/AppTitle.vue";

const { servicesItem } = useServices();

const swiperOptions = {
  loop: false,
  autoplay: false,
  slidesPerView: "auto",
  spaceBetween: 50,
  observer: true,
  observeParents: true,
  resizeObserver: true,
  navigation: {
    prevEl: ".services__btn--prev",
    nextEl: ".services__btn--next",
  },
  breakpoints: {
    320: { spaceBetween: 15, centeredSlides: true },
    768: { spaceBetween: 24, centeredSlides: false },
    992: { spaceBetween: 50, centeredSlides: false },
  },
  centeredSlides: false,
};
</script>

<template>
  <section class="main__services services ptb">
    <div class="services__container">
      <AppTitle
        title="Our Services"
        subtitle="Sub heading to explain more"
      />
      <div class="services__slider">
        <Animated
          type="fade-right"
          :delay="0.1"
        >
          <div class="swiper-slide services__slide--promo">
            <div class="services__card card">
              <h3 class="card__title">Get Started With Your Free Trial</h3>
              <p class="card__text">
                Explore yoga at our serene studio with a complimentary session. Meet our instructors and discover the
                benefits
              </p>
              <AppButton
                to="/"
                class="card__btn card__btn--promo"
                aria-label="Get Started Today"
              >
                Get Started Today
              </AppButton>
            </div>
          </div>
        </Animated>

        <AppSwiper
          v-if="swiperOptions"
          :options="swiperOptions"
          :navigation="false"
          class="services__swiper"
        >
          <div
            v-for="(service, index) in servicesItem"
            :key="index"
            class="swiper-slide services__slide"
          >
            <Animated
              type="fade-up"
              :delay="0.2 + index * 0.15"
              style="height: 100%; width: 100%"
            >
              <div class="services__card card">
                <div class="card__icon">
                  <component
                    :is="`svgo-${service.icon}`"
                    class="service__icon"
                  />
                </div>

                <h4 class="card__title">{{ service.title }}</h4>
                <p class="card__text">
                  {{ service.text }}
                </p>
                <AppButton
                  class="card__btn"
                  :aria-label="service.title"
                  :to="service.href"
                >
                  Learn More
                  <span class="card__hidden">{{ service.title }}</span>
                </AppButton>
              </div>
            </Animated>
          </div>
        </AppSwiper>
      </div>

      <Animated
        type="zoom-in"
        :stagger="0.15"
        :delay="0.4"
        class="services__nav"
      >
        <button
          class="services__btn services__btn--prev"
          aria-label="To Back"
        >
          <svgo-slider-arrow class="services__btn--arrow" />
        </button>
        <button
          class="services__btn services__btn--next"
          aria-label="To Front"
        >
          <svgo-slider-arrow class="services__btn--arrow" />
        </button>
      </Animated>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.main {
  // .main__services
  &__services {
    position: relative;
    z-index: 2;
    background-color: #fff;
  }
}

.services {
  overflow: hidden;

  // .services__slider
  &__slider {
    display: flex;
    align-items: center;
    margin-right: calc((100% - #{$maxWidthContainer}px) / -2 - 280px);

    @media (max-width: $mobile) {
      margin-right: 0;
      flex-direction: column;
      gap: 20px;
    }
  }

  // .services__slide--promo
  &__slide--promo {
    width: 320px;
    height: 100%;
    background-color: $colorAccent;
    padding: 100px 35px;
    border-radius: 25px;
    box-shadow:
      -48px 89px 80px 0 rgb(0 0 0 / 11%),
      -31px 58px 47px 0 rgb(0 0 0 / 8.35%),
      -18px 34px 25px 0 rgb(0 0 0 / 6.68%),
      -10px 18px 13px 0 rgb(0 0 0 / 5.5%),
      -4px 7px 7px 0 rgb(0 0 0 / 4.32%),
      -1px 2px 3px 0 rgb(0 0 0 / 2.65%);

    .card__title {
      color: #fff;
    }
    .card__text {
      color: #fff;
    }
  }

  // .services__slide
  &__slide {
    width: 294px;
    height: auto; // Позволяет Swiper растягивать слайды в одинаковую высоту
    display: flex;
    background-color: #f6f9fc;
    padding: 35px;
    border-radius: 25px;
    transition: transform 0.3s ease 0s;

    @media (any-hover: hover) {
      &:hover {
        transform: translateY(-15px);
      }
    }
  }

  // .services__card
  &__card {
    height: 100%;

    .service__icon {
      transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform;
    }

    @media (any-hover: hover) {
      &:hover {
        .service__icon {
          transform: rotate(360deg);
        }
      }
    }
  }

  // .services__swiper
  &__swiper {
    padding-left: 50px;
    padding-top: 15px;
    margin-top: -15px;

    :deep(.swiper-wrapper) {
      align-items: stretch; // 🔥 Все слайды встают в один уровень по высоте!
    }

    @media (max-width: $mobile) {
      padding-left: 0;
    }
  }

  // .services__nav
  &__nav {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
  }

  // .services__btn
  &__btn {
    display: flex;
    margin-top: 40px;
  }

  &__btn--prev {
    transform: rotate(180deg);
  }

  &__btn--arrow {
    width: 40px;
    height: 40px;
    color: $colorAccent;
  }
}

.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  justify-content: space-between;

  // .card__title
  &__title {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }

  // .card__text
  &__text {
    text-align: center;
    line-height: math.div(28, 16);
    flex-grow: 1;
  }

  // .card__btn
  &__btn {
    align-self: center;
    margin-top: auto;
    background-color: transparent;
    outline: 2px solid $colorAccent;
    outline-offset: -2px;
    color: $colorAccent;
    font-weight: 600;
    line-height: math.div(18, 16);
    padding: 10px 16px;
    border-radius: 10px;

    @media (any-hover: hover) {
      &:hover {
        background-color: $colorAccent;
        color: #fff;
      }
    }
  }

  &__btn--promo {
    background-color: #fff;
    outline: none;
    padding: 16px 24px;
  }

  &__icon {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    svg {
      width: 80px;
      height: 80px;
      color: $colorAccent;
    }
  }
  &__hidden {
    visibility: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
}

.swiper-button-disabled {
  cursor: default;
  svg {
    color: rgb(72 92 70 / 70%);
  }
}
</style>
