import { client } from 'src/lib/sanity.client';
import GoogleMaps from './googleMaps';

import { PublishedLocation } from '../interfaces_blog';
import { BlogPost } from 'src/components/BlogPost';
import { ImageTile } from 'src/components/ImageTile';

export default async function WhereAreWe () {
  const publishedLocations: PublishedLocation[] = await client.fetch(`
  *[_type == "location"]{
    locationName,
    mapLocation,
    slug{ current },
    "locationBlogPosts": *[_type=='blogPost' && references(^._id)]{
      _id,
      title,
      mainImage->{_createdAt, caption, image{ asset->{ path, url } }, author->{ name, slug } },
      author->,
      body[]{
        _type == 'blogImageRef' => @->{
          caption,
          image{
            asset->
          },
          imageTags
        },
        _type == 'imageCollectionRef' => @->{
          _id,
          collectionName,
          collectionImages[]->{
            caption,
            image{
              asset->
            },
            imageTags
          },
        },
        _type != 'reference' => @,
      },
      slug,
      publishedAt,
      categories,
  },
    "locationImages": *[_type=='blogImage' && references(^._id)]{
      _id,
      image{
        asset->
      }
    }
  }`);

  return (
    <div style={{ width: '100%' }}>
      <h1>Location</h1>
      <GoogleMaps locations={ publishedLocations }>

        { publishedLocations.map(({ locationName, locationBlogPosts, locationImages, _id }) => (
          <div data-location={locationName} key={ _id }>
            { locationBlogPosts?.length == 0 ?
              <h3 key={ locationName }>No blog posts from { locationName }</h3>
              : (
              <>
                <h3>BlogPosts from { locationName }</h3>
                { locationBlogPosts.map(blogPost => (
                  <BlogPost blogPost={ blogPost } key={ blogPost._id }/>
                )) }
              </>
            )}

            { locationImages.length == 0 ? <h3>No images from { locationName }</h3> : (
              <>
                <h3>Images from { locationName }</h3>
                { locationImages.map(image => (
                  <ImageTile photo={ image } key={ image._id }/>
                ))}
              </>
            )}

          </div>
        ))}

      </GoogleMaps>
    </div>
  );
};