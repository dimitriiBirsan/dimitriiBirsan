import rss from '@astrojs/rss';
import { getPosts, postHref } from '../../utils/content';
import { SITE_URL } from '../../consts';

export async function GET() {
  return rss({
    title: 'Dumitru Birsan — Articoli',
    description: 'Appunti su software engineering e comunità di sviluppatori.',
    site: SITE_URL,
    customData: '<language>it</language>',
    items: (await getPosts('it')).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postHref(post),
    })),
  });
}
