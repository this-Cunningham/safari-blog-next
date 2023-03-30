import Image from 'next/image';

import { BlogImage } from 'src/app/interfaces_blog';
import { Tag } from 'src/components/Tag';
import {  urlFor } from 'src/lib/imageHelpers';
import { client } from 'src/lib/sanity.client';
import { ImageNav } from '../GalleryNavigationArrows';

// Return a list of `params` to populate the [photoId] dynamic segment
// "generateStaticParams" is static rendering each of these dynamic routes at build time!
export async function generateStaticParams() {
  const blogImages: BlogImage[] = await client.fetch(`//groq
  *[_type == "blogImage"] {
    _id
  }`);

  return blogImages.map((post) => {
    return ({
      photoId: post._id,
    });
  });
}

export default async function DisplayImage ({ params }: { params: { photoId: string }}) {
  const blogImages: BlogImage[] = await client.fetch(`//groq
    *[_type == "blogImage" && _id == "${params.photoId}"]{
      _id,
      author->{name, slug},
      image{ ..., asset-> },
      tags[]->{"slug": slug.current, tagName},
      caption,
      location->{ locationName }
    }
  `);

  return (
    <>
      { blogImages.map(({ _id, image, author, location, caption, tags }) => (
        <div className='w-full max-w-3xl mx-auto relative group' key={ _id }>
          <Image
            className='h-auto w-full max-w-3xl'
            src={ urlFor(image).quality(100).url() }
            priority
            width={ image.asset.metadata.dimensions.width }
            height={ image.asset.metadata.dimensions.height }
            blurDataURL={ image.asset.metadata.lqip }
            placeholder='blur'
            alt={ caption ?? 'large image' }
          />

          <ImageNav _id={ _id } />

          <p>Photo by: { author?.name } { !!location ? ` - Taken in: ${ location?.locationName }`: null}</p>

          <p>{ caption }</p>

          { !!tags && !!tags?.length && (
            <>
              Tags: {' '}
              { tags.map(tag => <Tag tag={ tag } key={ 'slug-' + _id } /> )}
            </>
          )}
        </div>
      ))}
    </>
  );
}