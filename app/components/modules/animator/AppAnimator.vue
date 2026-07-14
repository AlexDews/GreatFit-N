<script setup>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let ctx;

const initAnimations = () => {
  ctx = gsap.context(() => {
    gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  });
};

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    initAnimations();
    ScrollTrigger.refresh();
  }, 100);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>
