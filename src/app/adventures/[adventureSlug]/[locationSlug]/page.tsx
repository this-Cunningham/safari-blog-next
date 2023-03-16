// location within an adventure

import { BlogPostData } from 'src/app/interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';
import { client } from 'src/lib/sanity.client';

// "generateStaticParams" is static rendering each of these dynamic routes at build time!
export async function generateStaticParams() {
  const adventureSlugs: ({
    adventureBlogPosts: { location: { slug: { current: string }}}[],
    adventureSlug: { current: string},
  })[] = await client.fetch(`//groq
    *[_type == "adventure"] {
      adventureBlogPosts[]->{
        location->{
          slug
        },
      },
      adventureSlug
    }
  `);
  // this must generate an array for all combinations of adventure x blogpost location
  // to be able to create all existing routes at build time
  // https://beta.nextjs.org/docs/api-reference/generate-static-params
  return adventureSlugs.flatMap(({ adventureSlug, adventureBlogPosts }) => {
    return adventureBlogPosts.map(({ location }) => ({
      adventureSlug: adventureSlug.current,
      locationSlug: location.slug.current,
    }));
  });
}

export default async function LocationWithinAdventure (
  { params }:
  { params : { adventureSlug: string; locationSlug: string }}) {
  const blogPostsForAdventureLocation: BlogPostData[] = await client.fetch(`//groq
    *[_type == 'blogPost'
      && _id in *[_type == 'adventure' && adventureSlug.current == '${params.adventureSlug}']
      .adventureBlogPosts[]->_id
      && location->.slug.current == '${params.locationSlug}'
    ]{
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
  `);

  // for a given adventure and location, show all blogposts from this adventure at this location
  return (
    <div>
    { blogPostsForAdventureLocation.length == 0 ?
      <h3>No blog posts from { params.locationSlug } in the { params.adventureSlug } adventure</h3>
      : (
      <div className='mb-9'>

        <h3 className='text-lg font-bold text-center mb-4'>
        Blog posts from { params.locationSlug } in the { params.adventureSlug } adventure
        </h3>

        <BlogPostTileList blogPosts={ blogPostsForAdventureLocation } />
      </div>
    ) }
  </div>
  );
}