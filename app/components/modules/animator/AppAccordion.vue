<!-- app\components\modules\animator\AppAccordion.vue -->
<script setup lang="ts">
import { gsap } from "gsap";

const props = defineProps<{
  isOpen: boolean;
}>();
const contentRef = ref<HTMLElement | null>(null);
let currentTween: gsap.core.Tween | null = null;
watch(
  () => props.isOpen,
  (open) => {
    if (!contentRef.value) return;
    if (currentTween) currentTween.kill();
    if (open) {
      currentTween = gsap.to(contentRef.value, {
        height: "auto",
        opacity: "1",
        duration: "0.4",
        ease: "power2.out",
        overflow: "hidden",
      });
    } else {
      currentTween = gsap.to(contentRef.value, {
        height: "0",
        opacity: "0",
        duration: "0.4",
        ease: "power2.out",
        overflow: "hidden",
      });
    }
  },
  { immediate: false },
);
onMounted(() => {
  if (currentTween) currentTween.kill();
  gsap.set(contentRef.value, {
    height: props.isOpen ? "auto" : 0,
    opacity: props.isOpen ? 1 : 0,
  });
});
</script>

<template>
  <div class="accordion__trigger">
    <slot name="trigger"></slot>
  </div>
  <div
    ref="contentRef"
    class="accordion__content"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.accordion__content {
  overflow: hidden;
}
</style>
