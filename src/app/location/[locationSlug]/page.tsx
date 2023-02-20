import { PublishedLocation as PublishedLocation } from 'src/app/interfaces_blog';
import { BlogPost } from 'src/components/BlogPost';
import { ImageTile } from 'src/components/ImageTile';
import { client } from 'src/lib/sanity.client';

export default async function Location ({ params }: { params: { locationSlug: string }}) {
  const publishedLocations: PublishedLocation[] = await client.fetch(`
  *[_type == "location" && slug.current == "${params.locationSlug}"]{
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
    <>
      { publishedLocations.map(({ locationName, locationBlogPosts, locationImages, }) => (
        <>
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

        </>
      ))}
    </>
  );
}