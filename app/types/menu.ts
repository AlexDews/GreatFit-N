// types/menu.ts
export interface MenuItem {
  id: number;
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
  children?: MenuItem[];
}
 