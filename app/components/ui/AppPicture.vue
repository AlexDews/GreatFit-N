<template>
  <picture class="app-picture">
    <source
      media="(max-width: 480px)"
      :srcset="img(mobileSrc || tabletSrc || desktopSrc, imgOptions)"
      :type="`image/${imgOptions.format}`"
    />

    <source
      media="(max-width: 1024px)"
      :srcset="img(tabletSrc || desktopSrc, imgOptions)"
      :type="`image/${imgOptions.format}`"
    />

    <img
      :src="img(desktopSrc, imgOptions)"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :fetchpriority="lazy ? 'auto' : 'high'"
      v-bind="$attrs"
    />
  </picture>
</template>

<script setup>
import { computed } from "vue";

const img = useImage();

const props = defineProps({
  desktopSrc: { type: String, required: true },
  tabletSrc: { type: String, default: "" },
  mobileSrc: { type: String, default: "" },
  alt: { type: String, default: "Изображение" },
  lazy: { type: Boolean, default: true },
  format: { type: String, default: "webp" },
  quality: { type: [Number, String], default: 90 },
  modifiers: {
    type: Object,
    default: () => ({}),
  },
});

const imgOptions = computed(() => {
  return {
    format: props.format,
    quality: props.quality,
    ...props.modifiers,
  };
});
</script>

<style lang="scss" scoped>
.app-picture {
  display: block;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    user-select: none;
    -webkit-user-drag: none;
  }
}
</style>
