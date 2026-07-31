<script setup>
import AppTitle from "@/components/ui/AppTitle.vue";
import AppTabs from "@/components/modules/tabs/AppTabs.vue";
import AppPicture from "@/components/ui/AppPicture.vue";
import AppButton from "@/components/ui/AppButton.vue";

const { classesItem } = useClasses();
</script>

<template>
  <section class="main__classes classes ptb">
    <div class="classes__container">
      <AppTitle
        title="Latest Classes"
        subtitle="Sub heading to explain more"
      />
      <Animated
        type="fade-up"
        :delay="0.3"
      >
        <div class="classes__tabs">
          <AppTabs
            id="yoga"
            :items="classesItem"
            class-tab="classes__tab"
            class-titles="classes__titles"
          >
            <template
              v-for="(item, index) in classesItem"
              :key="item.id || index"
              #[`content-${index}`]="{ activeIndex }"
            >
              <TabTransition>
                <div
                  v-if="activeIndex === index"
                  :key="index"
                  class="classes__content"
                >
                  <div class="classes__item">
                    <Animated
                      type="fade-right"
                      :duration="0.8"
                      :trigger="false"
                      class="classes__image"
                    >
                      <AppPicture
                        class="classes__img"
                        :aria-label="item.title"
                        desktop-src="/images/home/tabs-1.jpg"
                        alt="Classes Image"
                        format="avif"
                        quality="90"
                        :lazy="true"
                      />
                    </Animated>
                    <div class="classes__info">
                      <Animated
                        type="fade-up"
                        :duration="0.5"
                        :delay="0.1"
                        :trigger="false"
                      >
                        <h3 class="classes__info-title">{{ item.title }}</h3>
                        <p class="classes__info-text">{{ item.text }}</p>
                      </Animated>
                      <Animated
                        :key="`features-${activeIndex}`"
                        type="zoom-in"
                        :duration="0.4"
                        :delay="0.2"
                        :stagger="0.2"
                        :trigger="false"
                        class="classes__features"
                      >
                        <div
                          v-for="(feat, fIndex) in item.features"
                          :key="fIndex"
                          class="classes__feature"
                        >
                          <span class="classes__feature-num">{{ fIndex + 1 }}</span>
                          <span class="classes__feature-name">{{ feat.name }}</span>
                          <span class="classes__feature-text">{{ feat.text }}</span>
                        </div>
                      </Animated>
                    </div>
                  </div>
                  <AppButton
                    class="classes__btn-link"
                    aria-label="Get Your Free Trial"
                  >
                    Get Your Free Trial
                  </AppButton>
                </div>
              </TabTransition>
            </template>
          </AppTabs>
        </div>
      </Animated>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.main {
  // .main__classes
  &__classes {
    position: relative;
    z-index: 2;
    background-color: #f1efe5;
  }
}
.classes {
  // .classes__container
  &__container {
  }

  // .classes__tabs
  &__tabs {
  }

  // .classes__titles
  :deep(.classes__titles) {
    display: flex;
    justify-content: center;
    border: none;
  }

  // .classes__tab
  :deep(.classes__tab) {
    border: none;
    color: $fontColor;
    &._tab-active {
      border: 2px solid $colorAccent;
      border-radius: 15px;
      color: $fontColor;
    }
  }

  // .classes__content
  &__content {
    display: flex;
    color: $fontColor;
    flex-direction: column;
    align-items: center;

    @include adaptiveValue("gap", 48, 30, $containerWidth, $tablet);
  }

  // .classes__item
  &__item {
    display: flex;
    align-items: flex-start;

    @include adaptiveValue("gap", 48, 30, $containerWidth, $tablet);

    @media (max-width: $tablet) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  // .classes__image
  &__image {
    flex: 0 0 50%;
    min-width: 0;
  }

  // .classes__img
  :deep(.classes__img) {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;

    @media (max-width: $tablet) {
      max-width: 100%;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 15px; // Скругление как на скрине

      @media (max-width: $tablet) {
        max-width: 100%;
      }
    }
  }

  // .classes__info
  &__info {
    flex: 1 1 60%;
    min-width: 0;
  }

  // .classes__info-title
  &__info-title {
    @include adaptiveValue("font-size", 24, 18, $containerWidth, $tablet);
    @include adaptiveValue("margin-bottom", 25, 10, $containerWidth, $tablet);

    font-weight: 700;
  }

  // .classes__info-text
  &__info-text {
    line-height: math.div(28, 16);

    @include adaptiveValue("margin-bottom", 48, 30, $containerWidth, $tablet);
  }

  // .classes__features
  &__features {
    display: grid;
    grid-template-columns: 1fr 1fr;

    @include adaptiveValue("gap", 48, 30, $containerWidth, $tablet);

    @include media($mobile) {
      display: flex;
      flex-direction: column;
    }
  }

  // .classes__feature
  &__feature {
    display: flex;
    flex-direction: column;
    align-items: start;

    @include adaptiveValue("gap", 25, 10, $containerWidth, $tablet);

    @include media($mobile) {
      align-items: center;
    }
  }

  // .classes__feature-num
  &__feature-num {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 300;
    color: $colorAccent;
    border: 3px solid $colorAccent;
    border-radius: 50%;

    @include adaptiveValue("width", 90, 70, $containerWidth, $tablet);
    @include adaptiveValue("height", 90, 70, $containerWidth, $tablet);
    @include adaptiveValue("font-size", 64, 48, $containerWidth, $tablet);
  }

  // .classes__feature-name
  &__feature-name {
    @include adaptiveValue("font-size", 24, 18, $containerWidth, $tablet);

    font-weight: 700;
  }

  // .classes__feature-text
  &__feature-text {
    line-height: math.div(28, 16);
  }

  // .classes__btn-link
  &__btn-link {
    @include media($mobile) {
      margin-bottom: 30px;
    }
  }
}
</style>
