import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import styles from './BlogPostBlockContent.module.css';
import { BlockContentImg } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

const BlogImageBlockContent = ({ value }: { value: BlockContentImg }) => (
  <Image
    src={ urlFor(value.image).quality(100).url() }
    height={ 720 }
    width={ 720 }
    alt={ value.caption }
    className={ styles.nextBlogPostBodyImage }
  />
);

const ImageCollectionBlockContent = ({ value }: { value: { collectionImages: BlockContentImg[]} }) => (
  <div className={ styles.imageCollectionBlockContent }>
    { value.collectionImages?.map((image, index) => (
      <Image
        src={ urlFor(image.image).width(800).quality(100).url() }
        height={ 320 }
        width={ 400 }
        alt={ image.caption }
        className={ styles.imageCollectionImage }
        key={ image._id + String(index) }
      />
    ))}
  </div>
);

export const BlogPostBlockContent = ({ value }: { value: any[]}) => (
  <PortableText
    value={ value }
    components={{
      types: {
        blogImageRef: BlogImageBlockContent,
        imageCollectionRef: ImageCollectionBlockContent,
        }
    }}
  />
);