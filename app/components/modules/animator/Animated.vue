<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "scale-up"
  | "blur-in"
  | "slide-up"
  | "none";

interface Props {
  type?: AnimationType;
  duration?: number;
  delay?: number;
  stagger?: number;
  trigger?: boolean;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "fade-up",
  duration: 0.8,
  delay: 0,
  stagger: 0,
  trigger: true,
  start: "top 85%",
  end: "bottom 20%",
  scrub: false,
});

const root = ref<HTMLElement | null>(null);
let ctx: gsap.Context;

const animationMap: Record<AnimationType, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 40 },
  "fade-down": { opacity: 0, y: -40 },
  "fade-left": { opacity: 0, x: 40 },
  "fade-right": { opacity: 0, x: -40 },
  "zoom-in": { opacity: 0, scale: 0.8 },
  "zoom-out": { opacity: 0, scale: 1.2 },
  "scale-up": { opacity: 0, scale: 0.5 },
  "blur-in": { opacity: 0, filter: "blur(10px)" },
  "slide-up": { opacity: 0, y: 100 },
  none: {},
};

onMounted(() => {
  if (!root.value || props.type === "none") return;

  ctx = gsap.context(() => {
    const targets = props.stagger && root.value?.children.length ? root.value.children : root.value;

    const fromVars = animationMap[props.type] || animationMap["fade-up"];

    const toVars: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: props.duration,
      delay: props.delay,
      stagger: props.stagger || undefined,
      ease: "power3.out",
      // 💡 Очищаем ТОЛЬКО transform, чтобы не ломать CSS-ховеры, но оставляем opacity: 1!
      clearProps: "transform",
    };

    if (props.trigger) {
      toVars.scrollTrigger = {
        trigger: root.value,
        start: props.start,
        once: true, // Анимируется один раз при доскролле
      };
    }

    gsap.fromTo(targets, fromVars, toVars);
  }, root.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div
    ref="root"
    class="animated-element"
  >
    <slot />
  </div>
</template>

<style scoped>
.animated-element {
  will-change: transform, opacity;
}
</style>
