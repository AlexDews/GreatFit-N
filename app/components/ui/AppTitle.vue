<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <Animated
    type="fade-right"
    :delay="0.2"
    :trigger="true"
    stagger="0.2"
    class="app-title"
  >
    <h2 class="app-title__main">{{ title }}</h2>
    <p
      v-if="subtitle"
      class="app-title__sub"
    >
      {{ subtitle }}
    </p>
  </Animated>
</template>

<style lang="scss" scoped>
.app-title {
  &:where(&) {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 48px;
  }

  // .app-title__main
  &__main {
    &:where(&) {
      font-weight: 700;
      font-size: 52px;
      color: $fontColor;
    }
  }

  // .app-title__sub
  &__sub {
    &:where(&) {
      font-weight: 500;
      font-size: 20px;
      color: #000;
    }
  }
}
</style>
