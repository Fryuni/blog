import {SITE} from '@config';
import type {BlogFrontmatter} from '@content/_schemas.ts';
import {type CollectionEntry, getCollection} from 'astro:content';
import {slug as slugger} from 'github-slugger';

export type Post = CollectionEntry<'blog'>;
export type Posts = Post[];

export const getPosts = (): Promise<Posts> => getCollection(
  'blog',
  import.meta.env.PROD ? post => post.data.draft !== true : undefined,
);

export const slugifyStr = (str: string): string => slugger(str);

export const slugify = (post: BlogFrontmatter): string => (
  post.postSlug != null && post.postSlug !== ''
    ? slugger(post.postSlug)
    : slugger(post.title)
);

export const slugifyAll = (arr: string[]): string[] => arr.map(str => slugifyStr(str));

export const getPageNumbers = (numberOfPosts: number): number[] => {
  const numberOfPages = numberOfPosts / Number(SITE.postPerPage);

  const pageNumbers: number[] = [];

  for (let i = 1; i <= Math.ceil(numberOfPages); i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
};

export const getPostsByTag = (posts: Posts, tag: string): Posts => posts.filter(
  post => slugifyAll(post.data.tags).includes(tag),
);

export const getSortedPosts = (posts: Posts): Posts => posts.filter(({data}) => data.draft !== true)
  .sort(
    (a, b) => Math.floor(new Date(b.data.pubDateTime).getTime() / 1000)
        - Math.floor(new Date(a.data.pubDateTime).getTime() / 1000),
  );

export const getUniqueTags = (posts: Posts): string[] => posts
  .filter(({data}) => data.draft !== true)
  .flatMap(post => post.data.tags)
  .map(tag => slugifyStr(tag))
  .filter(
    (value: string, index: number, self: string[]) => self.indexOf(value) === index,
  )
  .sort((tagA: string, tagB: string) => tagA.localeCompare(tagB));
