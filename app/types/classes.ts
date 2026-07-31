// types/classes.ts
export interface ClassesItem {
  id: string;
  title: string;
  text: string;
  features: ClassFeature[];
}
export interface ClassFeature {
  name: string;
  text: string;
}
