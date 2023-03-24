// location within an adventure

import { BlogImage, BlogPostData } from 'src/app/interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';
import { ImageTileList } from 'src/components/ImageTile';
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
      slug,
      location->{
        locationName
      }
    }
  `);

  const adventureLocationPhotos: {images: BlogImage[]}[] = await client.fetch(`//groq
    *[_type == 'blogPost'
        && _id in *[_type == 'adventure' && adventureSlug.current == '${params.adventureSlug}']
        .adventureBlogPosts[]->_id
        && location->.slug.current == '${params.locationSlug}'
      ]{
      "images": array::compact([
        mainImage->{_id, image{asset->}},
        ...body[]{
          _type == 'blogImageRef' => @->{
            "images": [{_id, image{asset->}}]
            },
          _type == 'imageCollectionRef' => @->{
            "images": collectionImages[]->{_id, image{asset->}},
            },
        }.images[],
      ]),
  }`);

  const flatPhotoList = adventureLocationPhotos.flatMap(({ images }) => images);

  // for a given adventure and location, show all blogposts from this adventure at this location
  return (
    <div>
    { blogPostsForAdventureLocation.length == 0 ?
      <h3>No blog posts from { params.locationSlug } in the { params.adventureSlug } adventure</h3>
      : (
      <div className='mb-9'>
        <div className='flex justify-between'>
          <h3 className='font-serif font-normal text-lg sm:text-2xl md:text-3xl my-4 sm:my-8'>
            Posts from:
            <span className='font-bold font-sans'> { blogPostsForAdventureLocation[0].location.locationName }, { params.adventureSlug }</span>
          </h3>
        </div>

        <BlogPostTileList blogPosts={ blogPostsForAdventureLocation } />
        <h3 className='font-serif font-normal text-lg sm:text-2xl md:text-3xl my-4 sm:my-8'>
          Photos from: <span className='font-bold font-sans'>{ blogPostsForAdventureLocation[0].location.locationName }</span>
        </h3>
        <ImageTileList photos={ flatPhotoList } />
      </div>
    ) }
  </div>
  );
}