<!-- app/components/modules/tabs/TabTransition.vue -->
<script setup lang="ts">
import gsap from "gsap";

const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, y: 0, duration: 0.3, onComplete: done });
};
const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, duration: 0.2, ease: "power1.in", onComplete: done });
};
</script>

<template>
  <Transition
    mode="out-in"
    :css="false"
    :enter="onEnter"
    :leave="onLeave"
  >
    <slot />
  </Transition>
</template>
<style lang="scss" scoped></style>
