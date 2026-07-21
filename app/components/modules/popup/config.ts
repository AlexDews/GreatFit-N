// app/components/modules/popup/config.ts

export type PopupAnimationType =
  "fade" | "scale" | "zoom" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "rotate" | "flip" | "flip-x" | "flip-y" | "drop" | "bounce" | "elastic" | "blur";

interface PopupConfig {
  animationType: PopupAnimationType;
  animationDuration: number;
  animationEase: string;

  closeEsc: boolean;
  bodyLock: boolean;

  hashSettings: {
    location: boolean;
    goHash: boolean;
  };

  classes: {
    bodyActive: string;
  };

  on: {
    beforeOpen: (name: string) => void;
    afterOpen: (name: string) => void;
    beforeClose: (name: string) => void;
    afterClose: (name: string) => void;
  };
}

export const popupConfig: PopupConfig = {
  //~ --- GSAP Animation ---
  animationType: "flip",

  animationDuration: 0.35,

  animationEase: "power2.out",

  //~ --- Popup ---
  closeEsc: true,
  bodyLock: true,

  //~ --- Hash ---
  hashSettings: {
    location: true,
    goHash: true,
  },

  //~ --- Classes ---
  classes: {
    bodyActive: "popup-show",
  },

  //~ --- Events ---
  on: {
    beforeOpen: (_name: string) => {},
    afterOpen: (_name: string) => {},
    beforeClose: (_name: string) => {},
    afterClose: (_name: string) => {},
  },
};
