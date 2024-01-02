/*
 * Copyright (c) 2024.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Plug} from '@croct/plug';

declare module 'remark-collapse' {}

declare global {
  interface Window {
    croct: Plug;

    historyPatched?: boolean;
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
