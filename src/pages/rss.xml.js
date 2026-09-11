import rss from '@astrojs/rss';
import { getPosts, postHref } from '../utils/content';
import { SITE_URL } from '../consts';

export async function GET() {
  return rss({
    title: 'Dumitru Birsan — Writing',
    description: 'Notes on software engineering and developer communities.',
    site: SITE_URL,
    customData: '<language>en</language>',
    items: (await getPosts('en')).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postHref(post),
    })),
  });
}
