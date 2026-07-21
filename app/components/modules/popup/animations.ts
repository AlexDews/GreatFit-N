// app/components/modules/popup/animations.ts

import { gsap } from "gsap";
import { popupConfig } from "./config";

type PopupVars = gsap.TweenVars;

const getAnimation = (): {
  enter: PopupVars;
  leave: PopupVars;
} => {
  const duration = popupConfig.animationDuration;
  const ease = popupConfig.animationEase;

  switch (popupConfig.animationType) {
    case "fade":
      return {
        enter: {
          opacity: 1,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "scale":
      return {
        enter: {
          opacity: 1,
          scale: 1,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          scale: 0.85,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "zoom":
      return {
        enter: {
          opacity: 1,
          scale: 1,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          scale: 0.4,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "slide-up":
      return {
        enter: {
          opacity: 1,
          y: 0,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          y: -60,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "slide-down":
      return {
        enter: {
          opacity: 1,
          y: 0,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          y: 60,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "slide-left":
      return {
        enter: {
          opacity: 1,
          x: 0,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          x: -80,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "slide-right":
      return {
        enter: {
          opacity: 1,
          x: 0,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          x: 80,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "rotate":
      return {
        enter: {
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          rotation: 12,
          scale: 0.9,
          duration: duration * 0.8,
          ease: "power2.in",
        },
      };

    case "flip":
    case "flip-y":
      return {
        enter: {
          opacity: 1,
          rotationY: 0,
          duration: duration + 0.1,
          ease: "back.out(1.4)",
        },
        leave: {
          opacity: 0,
          rotationY: 90,
          duration,
          ease: "power2.in",
        },
      };

    case "flip-x":
      return {
        enter: {
          opacity: 1,
          rotationX: 0,
          duration: duration + 0.1,
          ease: "back.out(1.4)",
        },
        leave: {
          opacity: 0,
          rotationX: 90,
          duration,
          ease: "power2.in",
        },
      };

    case "drop":
      return {
        enter: {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "bounce.out",
        },
        leave: {
          opacity: 0,
          y: -120,
          duration,
          ease: "power2.in",
        },
      };

    case "bounce":
      return {
        enter: {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "bounce.out",
        },
        leave: {
          opacity: 0,
          y: 80,
          duration,
          ease: "power2.in",
        },
      };

    case "elastic":
      return {
        enter: {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1,0.5)",
        },
        leave: {
          opacity: 0,
          scale: 0.7,
          duration: duration,
          ease: "power2.in",
        },
      };

    case "blur":
      return {
        enter: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration,
          ease,
        },
        leave: {
          opacity: 0,
          scale: 0.95,
          filter: "blur(12px)",
          duration,
          ease: "power2.in",
        },
      };

    default:
      return {
        enter: {
          opacity: 1,
          duration,
        },
        leave: {
          opacity: 0,
          duration,
        },
      };
  }
};

export const popupEnter = (el: Element, done: () => void) => {
  const popup = el as HTMLElement;
  const wrapper = popup.querySelector(".popup__wrapper") as HTMLElement | null;

  if (!wrapper) {
    done();
    return;
  }

  const { enter } = getAnimation();

  const tl = gsap.timeline({
    onComplete: done,
  });

  gsap.set(wrapper, {
    transformPerspective: 1000,
    transformOrigin: "center center",
  });

  tl.fromTo(
    popup,
    {
      backgroundColor: "rgba(0,0,0,0)",
    },
    {
      backgroundColor: "rgba(0,0,0,.5)",
      duration: 0.25,
      ease: "power1.out",
    },
    0,
  );

  tl.fromTo(
    wrapper,
    {
      opacity: 0,

      scale: popupConfig.animationType === "zoom" ? 0.4 : popupConfig.animationType === "elastic" ? 0.6 : popupConfig.animationType === "scale" ? 0.85 : 1,

      x: popupConfig.animationType === "slide-left" ? -80 : popupConfig.animationType === "slide-right" ? 80 : 0,

      y:
        popupConfig.animationType === "slide-up"
          ? 80
          : popupConfig.animationType === "slide-down"
            ? -80
            : popupConfig.animationType === "drop"
              ? -250
              : popupConfig.animationType === "bounce"
                ? 120
                : 0,

      rotation: popupConfig.animationType === "rotate" ? -12 : 0,

      rotationX: popupConfig.animationType === "flip-x" ? 90 : 0,

      rotationY: popupConfig.animationType === "flip" || popupConfig.animationType === "flip-y" ? 90 : 0,

      filter: popupConfig.animationType === "blur" ? "blur(12px)" : "blur(0px)",
    },
    enter,
    0,
  );
};

export const popupLeave = (el: Element, done: () => void) => {
  const popup = el as HTMLElement;
  const wrapper = popup.querySelector(".popup__wrapper") as HTMLElement | null;

  if (!wrapper) {
    done();
    return;
  }

  const { leave } = getAnimation();

  const tl = gsap.timeline({
    onComplete: done,
  });

  tl.to(wrapper, leave, 0);

  tl.to(
    popup,
    {
      backgroundColor: "rgba(0,0,0,0)",
      duration: 0.2,
      ease: "power1.in",
    },
    0,
  );
};
