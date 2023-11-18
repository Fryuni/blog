import {Plug} from '@croct/plug';

declare module 'remark-collapse' {}

declare global {
  interface Window {
    croct: Plug;
  }

  declare const croct: Plug;
}

declare module '@croct/plug/slot' {
  interface VersionedSlotMap {
    'home-intro': {
      '1': {
        _component: 'intro@1',
        title: string,
        introduction: string,
      },

      '2': {
        _component: 'intro@2',
        title: string,
        introduction: string,
        showRss: boolean,
      },

      latest: VersionedSlotMap['home-intro']['2'],
    };
  }
}
