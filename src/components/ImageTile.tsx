import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import { BlogImage } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageHelpers';
import {
  CurrentImageIndexContext,
  ImageListContext,
  LoadImageContext
} from 'src/providers/ImageContext';

const ImageTileClientWrapper = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const [currentImageIdList, ] = useContext(ImageListContext);
  const [, setCurrentImageIndex] = useContext(CurrentImageIndexContext);

  const setImgIndex = () => {
    setCurrentImageIndex(index);
  };

  return (
    <Link href={ `/photos/${currentImageIdList[index]}` }
      onClick={ setImgIndex }
      className='flex grow w-60 h-auto rounded ease-out transition-all duration-[250ms]
      hover:scale-[1.02] hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]'
    >
      { children }
    </Link>
  );
};
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