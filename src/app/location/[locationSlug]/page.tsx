import { PublishedLocation } from 'src/app/interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';
import { ImageTileList } from 'src/components/ImageTile';
import { client } from 'src/lib/sanity.client';

export default async function WhereAreWe ({ params }: { params: { locationSlug: string }}) {
  const publishedLocations: PublishedLocation[] = await client.fetch(`//groq
    *[_type == "location" && slug.current == "${params.locationSlug}"]{
      locationName,
      mapLocation,
      slug{ current },
      "locationBlogPosts": *[_type=='blogPost' && references(^._id)] | order(publishedAt desc){
        _id,
        title,
        excerpt,
        mainImage->{_createdAt, caption, image{ ..., asset-> }, author->{ name, slug } },
        slug,
        publishedAt,
        tags[]->{"slug": slug.current, tagName},
    },
      "locationImages": *[_type=='blogImage' && references(^._id)]{
        _id,
        image{
          ...,
          asset->
        },
        caption,
      }
    }`);

  return (
    <>
      { publishedLocations.map(({ locationName, locationBlogPosts, locationImages, _id }) => {
        return (
          <div data-location={ locationName } key={ _id }>
            { locationBlogPosts?.length == 0 ?
              <h3 key={ locationName }>No blog posts from { locationName }</h3>
              : (
                <div className='mb-9'>
                  <h3 className='text-lg font-bold text-center mb-4'>BlogPosts from { locationName }</h3>
                  <BlogPostTileList blogPosts={ locationBlogPosts } />
                </div>
              ) }

            { locationImages.length == 0 ? <h3>No images from { locationName }</h3> : (
              <>
                <h3 className='text-lg font-bold text-center mb-4'>Images from { locationName }</h3>
                <ImageTileList photos={ locationImages } />
              </>
            ) }
          </div>
        );
      })}
    </>
  );
};