<template>
  <div
    ref="marqueeContainer"
    class="ln-marquee"
    :class="{
      '_pause-on-hover': pauseOnHover,
      'ln-marquee--vertical': direction === 'vertical',
      'ln-marquee--horizontal': direction !== 'vertical',
    }"
  >
    <div
      ref="runLine"
      class="ln-marquee__run-line"
      :style="{
        '--marquee-dimension': `-${dimension}px`,
        '--marquee-duration': `${baseDuration}s`,
        '--marquee-reverse': reverse ? 'reverse' : 'normal',
      }"
    >
      <div
        ref="originalList"
        class="ln-marquee__list _original"
      >
        <slot></slot>
      </div>

      <div
        class="ln-marquee__list _clone"
        aria-hidden="true"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { marqueeDefaults } from "./config";

const props = withDefaults(
  defineProps<{
    baseDuration?: number;
    direction?: "horizontal" | "vertical";
    reverse?: boolean;
    pauseOnHover?: boolean;
  }>(),
  {
    baseDuration: () => marqueeDefaults.baseDuration,
    direction: () => marqueeDefaults.direction as "horizontal" | "vertical",
    reverse: () => marqueeDefaults.reverse,
    pauseOnHover: () => marqueeDefaults.pauseOnHover,
  },
);

const marqueeContainer = ref<HTMLElement | null>(null);
const runLine = ref<HTMLElement | null>(null);
const originalList = ref<HTMLElement | null>(null);

const dimension = ref<number>(0);
let resizeObserver: ResizeObserver | null = null;

const updateDimensions = () => {
  if (!originalList.value) return;

  dimension.value = props.direction === "vertical" ? originalList.value.offsetHeight : originalList.value.offsetWidth;
};

onMounted(() => {
  if (originalList.value) {
    resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(originalList.value);
  }
  updateDimensions();
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style scoped>
.ln-marquee {
  overflow: hidden;
  width: 100%;
  display: flex;
}

.ln-marquee__run-line {
  display: flex;
  will-change: transform;
  animation: lnMarqueeAnim var(--marquee-duration) linear infinite;
  animation-direction: var(--marquee-reverse, normal);
  transition: animation-play-state 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.ln-marquee__list {
  display: flex;
  flex-shrink: 0;
}

/* --- Направления (твои классические БЭМ-классы) --- */

.ln-marquee--horizontal .ln-marquee__run-line,
.ln-marquee--horizontal .ln-marquee__list {
  flex-direction: row;
}

.ln-marquee--vertical .ln-marquee__run-line,
.ln-marquee--vertical .ln-marquee__list {
  flex-direction: column;
}

.ln-marquee--vertical .ln-marquee__run-line {
  animation-name: lnMarqueeAnimV;
}

/* Пауза */
.ln-marquee._pause-on-hover:hover .ln-marquee__run-line {
  animation-play-state: paused;
}

/* Анимации движения */
@keyframes lnMarqueeAnim {
  to {
    transform: translateX(var(--marquee-dimension));
  }
}

@keyframes lnMarqueeAnimV {
  to {
    transform: translateY(var(--marquee-dimension));
  }
}
</style>
