import { PublishedLocation } from 'src/app/interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';
import { ImageTileList } from 'src/components/ImageTile';
import { client } from 'src/lib/sanity.client';

export default async function Locations () {
  const publishedLocations: PublishedLocation[] = await client.fetch(`//groq
    *[_type == "location"]{
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
        caption
      }
    }`);

  const locationsWithBlogPostsSorted = publishedLocations.filter(location => {
    return location.locationBlogPosts.length !== 0;
  }).sort((a, b) => {
    const aTime = new Date(a.locationBlogPosts[0].publishedAt).getTime();
    const bTime = new Date(b.locationBlogPosts[0].publishedAt).getTime();

    return aTime - bTime;
  });

  const {
    _id,
    locationName,
    locationBlogPosts,
    locationImages
  } = locationsWithBlogPostsSorted[locationsWithBlogPostsSorted.length - 1];

  return (
    <>
      <div data-location={locationName} key={ _id }>
        { locationBlogPosts?.length == 0 ?
          <h3 key={ locationName }>No blog posts from { locationName }</h3>
          : (
          <>
            <h3 className='text-center'>BlogPosts from { locationName }</h3>
            <br />
            <BlogPostTileList blogPosts={ locationBlogPosts } />
          </>
        )}

        { locationImages.length == 0 ? <h3>No images from { locationName }</h3> : (
          <>
            <h3>Images from { locationName }</h3>
            <ImageTileList photos={ locationImages } />
          </>
        )}
      </div>
    </>
  );
};