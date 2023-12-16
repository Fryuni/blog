import type {RemarkPlugin} from '@astrojs/markdown-remark';
import {toString} from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export const remarkReadTimePlugin: RemarkPlugin = () => (tree, {data}) => {
  const readingTime = getReadingTime(toString(tree));

  // eslint-disable-next-line no-param-reassign -- mutate data
  (data.astro as any).frontmatter.readingTime = readingTime;
};
