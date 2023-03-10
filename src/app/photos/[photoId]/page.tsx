import Image from 'next/image';

import { BlogImage } from 'src/app/interfaces_blog';
import { Tag } from 'src/components/Tag';
import { urlFor } from 'src/lib/imageUrlBuilder';
import { client } from 'src/lib/sanity.client';

import styles from '../Photos.module.css';

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
      { blogImages.map(({ image, author, location, caption, tags }) => (
        <>
          <div>
            <Image
              src={ urlFor(image).quality(100).url() }
              priority
              width={ 720 }
              height={ 720 }
              alt={ caption }
              className={ styles.nextDisplayImage }
            />
          </div>
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