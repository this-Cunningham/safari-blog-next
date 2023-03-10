import Image from 'next/image';

import { BlogImage } from 'src/app/interfaces_blog';
import { Tag } from 'src/components/Tag';
import { urlFor } from 'src/lib/imageUrlBuilder';
import { client } from 'src/lib/sanity.client';

import styles from '../Photos.module.css';

// Return a list of `params` to populate the [photoId] dynamic segment
// "generateStaticParams" is static rendering each of these dynamic routes at build time!
export async function generateStaticParams() {
  const blogImages: BlogImage[] = await client.fetch(`//groq
  *[_type == "blogImage"] {
    _id
  }`);

  return blogImages.map((post) => ({
    photoId: post._id,
  }));
}

export default async function DisplayImage ({ params }: { params: { photoId: string }}) {
  const blogImages: BlogImage[] = await client.fetch(`//groq
    *[_type == "blogImage" && _id == "${params.photoId}"]{
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
        <>
          <Image
            src={ urlFor(image).quality(100).url() }
            priority
            width={ image.asset.metadata.dimensions.width }
            height={ image.asset.metadata.dimensions.height }
            alt={ caption }
            blurDataURL={ image.asset.metadata.lqip }
            placeholder='blur'
            className={ styles.nextDisplayImage }
            key={ _id }
          />
          <p>Photo by: { author.name } { !!location ? ` - Taken in: ${ location?.locationName }`: null}</p>
          <p>{ caption }</p>
          { tags && tags.length && (
            <>
              Tags: {' '}
              { tags.map(tag => <Tag tag={ tag } key={ tag.slug } /> )}
            </>
          )}
        </>
      ))}
    </>
  );
}