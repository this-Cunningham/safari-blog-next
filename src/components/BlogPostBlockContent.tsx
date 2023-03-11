import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import styles from './BlogPostBlockContent.module.css';
import { BlockContentImg } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

const BlogImageBlockContent = ({ value: { image, caption }}: { value: BlockContentImg }) => (
  <Image
    src={ urlFor(image).quality(100).url() }
    height={ 720 / image.asset.metadata.dimensions.aspectRatio }
    width={ 720 }
    placeholder='blur'
    blurDataURL={ image.asset.metadata.lqip }
    alt={ caption }
    className={ styles.nextBlogPostBodyImage }
  />
);

const ImageCollectionBlockContent = ({ value }: { value: { collectionImages: BlockContentImg[] } }) => (
  <div className={ styles.imageCollectionBlockContent }>
    { value.collectionImages?.map(({ image, caption, _id }, index) => (
      <Image
        src={ urlFor(image).width(720).quality(100).url() }
        height={ 320 }
        width={ 320 * image.asset.metadata.dimensions.aspectRatio }
        placeholder='blur'
        blurDataURL={ image.asset.metadata.lqip }
        alt={ caption }
        className={ styles.imageCollectionImage }
        key={ _id + String(index) }
      />
    ))}
  </div>
);

export const BlogPostBlockContent = ({ value }: { value: any[] }) => (
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