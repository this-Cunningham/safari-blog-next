// current/most-recent adventure

import { BlogPostTileList } from 'src/components/BlogPostTile';
import { client } from 'src/lib/sanity.client';
import { Adventure } from 'src/app/interfaces_blog';

export default async function CurrentAdventure () {
  const adventure: Adventure = await client.fetch(`//groq
    *[_type == "adventure"][0] {
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
        } | order(publishedAt desc)
    }`);

  return (
    <div>
      { adventure.adventureBlogPosts.length == 0 ?
        <h3>No blog posts from the { adventure.adventureName } adventure</h3>
        : (
        <div className='mb-9'>
          <h3 className='font-serif font-normal text-lg sm:text-3xl sm:my-8'>
            Posts from: <span className='font-bold font-sans'>{ adventure.adventureName }</span>
          </h3>

          <BlogPostTileList blogPosts={ adventure.adventureBlogPosts } />
        </div>
      ) }
    </div>
  );
}