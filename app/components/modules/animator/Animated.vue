<!-- app\components\modules\animator\Animated.vue -->
<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationType =
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

const props = withDefaults(
  defineProps<{
    type?: AnimationType;
    duration?: number;
    delay?: number;
    trigger?: boolean;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    stagger?: number;
    from?: Record<string, gsap.TweenVars>;
    to?: Record<string, gsap.TweenVars>;
    ease?: string;
  }>(),
  {
    type: "fade-up",
    duration: 0.8,
    delay: 0,
    trigger: true,
    start: "top 85%",
    end: "bottom top",
    scrub: false,
    stagger: 0,
    from: () => ({}),
    to: () => ({}),
    ease: "power2.out",
  },
);

const root = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

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
    const fromValues: gsap.TweenVars = {
      ...animationMap[props.type],
      ...props.from,
    };
    const toValues: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: props.duration,
      delay: props.delay,
      ease: props.ease,
      ...props.to,
    };
    if (props.trigger) {
      toValues.scrollTrigger = {
        trigger: root.value,
        start: props.start,
        end: props.end,
        scrub: props.scrub,
        toggleActions: "play none none reverse",
      };
    }
    gsap.fromTo(root.value, fromValues, toValues);
  }, root.value);
});
onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>
<template>
  <div
    ref="root"
    class="animated"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.animated {
  will-change: transform, opacity;
}
</style>
