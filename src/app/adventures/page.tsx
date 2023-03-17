// current/most-recent adventure

import { BlogPostTileList } from 'src/components/BlogPostTile';
import { client } from 'src/lib/sanity.client';
import { Adventure } from '../interfaces_blog';

export default async function CurrentAdventure () {
  const adventure: Adventure = await client.fetch(`//groq
    *[_type == "adventure"] | order(publishedAt desc)[0] {
      _id,
        adventureName,
        adventureSlug,
        adventureBlogPosts[]->{
          _id,
          title,
          mainImage->{
            caption,
            image{ asset ->},
          },
          excerpt,
          publishedAt,
          slug
        }
    }`);

  return (
    <div>
      { adventure.adventureBlogPosts.length == 0 ?
        <h3>No blog posts from the { adventure.adventureName } adventure</h3>
        : (
        <div className='mb-9'>

          <h3 className='font-serif font-normal text-lg sm:text-3xl sm:my-10'>
            Posts from: { adventure.adventureName }
          </h3>

          <BlogPostTileList blogPosts={ adventure.adventureBlogPosts } />
        </div>
      ) }
    </div>
  );
}