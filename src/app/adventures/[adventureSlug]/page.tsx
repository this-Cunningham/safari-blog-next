// adventure based on adventureSlug

import { Adventure } from 'src/app/interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';
import { client } from 'src/lib/sanity.client';

// Return a list of `params` to populate the [adventureSlug] dynamic segment
// "generateStaticParams" is static rendering each of these dynamic routes at build time!
export async function generateStaticParams() {
  const adventureSlugs: ({ adventureSlug: { current: string }})[] = await client.fetch(`//groq
    *[_type == "adventure"] {
      adventureSlug{ current },
    }
  `);

  return adventureSlugs.map(({ adventureSlug }) => ({
    adventureSlug: adventureSlug.current,
  }));
}

export default async function SelectedAdventure ({ params }: { params: { adventureSlug: string }}) {
  const adventure: Adventure = await client.fetch(`//groq
    *[_type == "adventure" && adventureSlug.current == '${params.adventureSlug}'][0]{
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
        } | order(publishedAt asc)
    }`);

  return (
    <div>
      { adventure.adventureBlogPosts.length == 0
        ? <h3>No blog posts from the { adventure.adventureName } adventure</h3>
        : (
          <div className='mb-9'>

            <h3 className='font-serif font-normal text-lg sm:text-3xl sm:my-8'>
              Posts from: <span className='font-bold font-sans'>{ adventure.adventureName }</span>
            </h3>

            <BlogPostTileList blogPosts={ adventure.adventureBlogPosts } />
          </div>
        )
      }
    </div>
  );
}