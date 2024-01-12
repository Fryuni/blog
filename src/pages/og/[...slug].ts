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
import {OGImageRoute} from 'astro-og-canvas';
import {getCollection} from 'astro:content';

export const prerender = true;

const paths = await getCollection('docs');

const pages = Object.fromEntries(paths.map(
  ({id, data}) => [id, data],
));

export const {getStaticPaths, GET} = OGImageRoute({
  pages,
  param: 'slug',
  getImageOptions: (_path, page: (typeof pages)[number]) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/logo/fancy.png',
      size: [250, 250],
    },
    bgGradient: [[24, 24, 27]],
    border: {color: [63, 63, 70], width: 20},
    padding: 60,
  }),
});
