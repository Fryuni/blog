import { Plug } from '@croct/plug';

declare module 'remark-collapse' {}

declare global {
  interface Window {
    croct: Plug;
  }

  declare const croct: Plug;
}
