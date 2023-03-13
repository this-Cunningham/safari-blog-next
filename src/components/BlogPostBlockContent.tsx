import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import { BlockContentImg } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

const BlogImageBlockContent = ({ value: { image, caption }}: { value: BlockContentImg }) => (
  <Image
    className='w-full h-auto rounded'
    src={ urlFor(image).quality(100).url() }
    height={ 720 / image.asset.metadata.dimensions.aspectRatio }
    width={ 720 }
    placeholder='blur'
    blurDataURL={ image.asset.metadata.lqip }
    alt={ caption }
  />
);

const ImageCollectionBlockContent = ({ value }: { value: { collectionImages: BlockContentImg[] } }) => (
  <div className='flex gap-2 h-80 py-3 px-0 overflow-x-scroll overflow-y-hidden'>
    { value.collectionImages?.map(({ image, caption, _id }, index) => (
      <div className='group relative' key={ _id + String(index) }>
        <Image
          className='h-full w-auto max-w-fit rounded'
          src={ urlFor(image).width(720).quality(100).url() }
          height={ 320 }
          width={ 320 * image.asset.metadata.dimensions.aspectRatio }
          placeholder='blur'
          blurDataURL={ image.asset.metadata.lqip }
          alt={ caption }
        />
        <p className='hidden
          group-hover:inline group-hover:text-xs group-hover:m-0 group-hover:absolute group-hover:right-0 group-hover: left-0 group-hover:bottom-0 group-hover:p-2 group-hover:font-light  group-hover:bg-opacity-70 group-hover:text-black group-hover:bg-[#E8ddcb]'>
          { caption }
        </p>
      </div>
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
        normal: ({ children }) => <p className='text-base leading-[1.4rem]'>{ children }</p>,
      },
    }}
  />
);