import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import { BlockContentImg } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageHelpers';

const BlogImageBlockContent = ({ value: { image, caption }}: { value: BlockContentImg }) => (
  <Image
    className='w-full h-auto rounded'
    src={ urlFor(image).quality(100).url() }
    height={ 720 / image.asset.metadata.dimensions.aspectRatio }
    width={ 720 }
    placeholder='blur'
    blurDataURL={ image.asset.metadata.lqip }
    alt={ caption ?? 'blog image' }
  />
);

const ImageCollectionBlockContent = ({ value }: { value: { collectionImages: BlockContentImg[] } }) => (
  <div className='flex gap-2 h-80 py-3 px-0 overflow-x-scroll overflow-y-hidden'>
    { value.collectionImages?.map(({ image, caption, _id }, index) => (
      <Image
        className='h-full w-auto max-w-fit rounded'
        src={ urlFor(image).width(720).quality(100).url() }
        height={ 320 }
        width={ 320 * image.asset.metadata.dimensions.aspectRatio }
        placeholder='blur'
        blurDataURL={ image.asset.metadata.lqip }
        alt={ caption ?? 'blog image' }
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
      },
      block: {
        normal: ({ children }) => <p className='text-base leading-[1.3rem]'>{ children }</p>,
        h2: ({ children }) => <h2 className='font-serif text-[56px] leading-[75px]'>{ children }</h2>,
        h3: ({ children }) => <h3 className='font-serif text-[40px] leading-[54px]'>{ children }</h3>,
        h4: ({ children }) => <h4 className='font-serif text-[32px] leading-[43px]'>{ children }</h4>
      },
    }}
  />
);