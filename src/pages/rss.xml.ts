import rss, {type RSSFeedItem} from '@astrojs/rss';
import {SITE} from '@config';
import {getPosts, getSortedPosts, slugify} from '@utils/posts';

export async function GET(): Promise<Response> {
  const posts = await getPosts();
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(
      ({data}): RSSFeedItem => ({
        link: `posts/${slugify(data)}`,
        title: data.title,
        description: data.description,
        pubDate: new Date(data.pubDateTime),
      }),
    ),
  });
}
