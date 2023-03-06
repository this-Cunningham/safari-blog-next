import { client } from 'src/lib/sanity.client';
import GoogleMaps from './googleMaps';

import { PublishedLocation } from '../interfaces_blog';
import { ImageTile } from 'src/components/ImageTile';
import { BlogPostTileList } from 'src/components/BlogPostTile';

export default async function WhereAreWe () {
  const publishedLocations: PublishedLocation[] = await client.fetch(`//groq
    *[_type == "location"]{
      locationName,
      mapLocation,
      slug{ current },
      "locationBlogPosts": *[_type=='blogPost' && references(^._id)] | order(publishedAt desc){
        _id,
        title,
        excerpt,
        mainImage->{_createdAt, caption, image{ asset->{ path, url } }, author->{ name, slug } },
        slug,
        publishedAt,
        tags[]->{"slug": slug.current, tagName},
      },
      "locationImages": *[_type=='blogImage' && references(^._id)]{
        _id,
        image{
          asset->
        }
      }
    }
  `);

  const locationsWithBlogPostsSorted = publishedLocations.filter(location => {
    return location.locationBlogPosts.length !== 0;
  }).sort((a, b) => {
    const aTime = new Date(a.locationBlogPosts[0].publishedAt).getTime();
    const bTime = new Date(b.locationBlogPosts[0].publishedAt).getTime();

    return aTime - bTime;
  });

  return (
    <div style={{ width: '100%' }}>
      <h1>Location</h1>
      <GoogleMaps locations={ locationsWithBlogPostsSorted }>

        { publishedLocations.map(({ locationName, locationBlogPosts, locationImages, _id }) => (
          <div data-location={locationName} key={ _id }>
            { locationBlogPosts?.length == 0 ?
              <h3 key={ locationName }>No blog posts from { locationName }</h3>
              : (
              <>
                <h3 style={{ textAlign: 'center' }}>BlogPosts from { locationName }</h3>
                <br />
                <BlogPostTileList blogPosts={ locationBlogPosts } />
              </>
            )}

            { locationImages.length == 0 ? <h3>No images from { locationName }</h3> : (
              <>
                <h3>Images from { locationName }</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '16px' }}>
                  { locationImages.map(image => (
                    <ImageTile photo={ image } key={ image._id }/>
                  ))}
                </div>
              </>
            )}

          </div>
        ))}

      </GoogleMaps>
    </div>
  );
};