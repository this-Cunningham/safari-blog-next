'use client';

import Link from 'next/link';
import { useContext } from 'react';

import { ImageListContext, CurrentImageIndexContext } from 'src/providers/ImageContext';

export const ImageTileClientWrapper = ({ children, index }: { children: React.ReactNode; index: number }) => {
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