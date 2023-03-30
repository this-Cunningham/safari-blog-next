import Image from 'next/image';

import { BlogImage } from 'src/app/interfaces_blog';
import { ImageTileClientWrapper } from 'src/app/photos/GalleryNavigationArrows';
import { urlFor } from 'src/lib/imageHelpers';
import { LoadImageContext } from 'src/providers/ImageContext';

const ImageTile = ({ photo, index }: { photo: BlogImage; index: number }) => (
  <ImageTileClientWrapper index={ index }>
    <Image
      className='rounded w-full h-auto'
      src={ urlFor(photo.image).height(300).width(300*1.77).quality(100).url() }
      height={ 300 }
      width={ 300*1.77 }
      placeholder='blur'
      blurDataURL={ photo.image.asset.metadata.lqip }
      priority={ index < 6 }
      alt={ photo.caption ?? 'small image on a tile' }
    />
  </ImageTileClientWrapper>
);

export const ImageTileList = ({ photos }: { photos: BlogImage[] }) => (
  <>
    <LoadImageContext imageIdList={ photos.map(({ _id }) => _id) } />

    <div className='flex flex-wrap gap-2 after:w-60 after:flex-grow'>
      { photos.map((photo, index) => (
        <ImageTile photo={ photo } index={ index } key={ photo._id } />
      ))}
    </div>
  </>
);