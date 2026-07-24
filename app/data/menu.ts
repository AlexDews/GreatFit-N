// data/menu.ts
import type { MenuItem } from "~/types/menu";

export const menuItems: MenuItem[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
    external: false,
  },
  {
    id: 2,
    label: "Services",
    href: "/services",
    external: false,
    children: [
      {
        id: 21,
        label: "Spa Area",
        href: "/services/spa-area",
        external: false,
      },
      {
        id: 22,
        label: "Changing Room",
        href: "/services/changing-room",
        external: false,
      },
      {
        id: 23,
        label: "Free Lessons",
        href: "/services/free-lessons",
        external: false,
      },
      {
        id: 24,
        label: "Free Rug",
        href: "/services/free-rug",
        external: false,
      },
    ],
  },
  {
    id: 3,
    label: "Our Facility",
    href: "/our-facility",
    external: false,
    children: [
      {
        id: 31,
        label: "Beginners Yoga",
        href: "/facility/yoga",
        external: false,
      },
      {
        id: 32,
        label: "Stretching",
        href: "/facility/stretching",
        external: false,
      },
      {
        id: 33,
        label: "Fly-Yoga",
        href: "/facility/fly",
        external: false,
      },
    ],
  },
  {
    id: 4,
    label: "About",
    href: "/about",
    external: false,
  },
  {
    id: 5,
    label: "Contact",
    href: "/contact",
    external: false,
  },
];
