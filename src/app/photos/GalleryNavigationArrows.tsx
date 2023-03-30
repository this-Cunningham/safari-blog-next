'use client';

import Link from 'next/link';
import { useContext, useEffect } from 'react';

import { LeftChevron, RightChevron } from 'src/components/atoms/ChevronSvgs';
import { ImageListContext, CurrentImageIndexContext } from 'src/providers/ImageContext';

const PreviousPhotoLink = ({ previousPhotoId }: { previousPhotoId: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useContext(CurrentImageIndexContext);

  if (!currentImageIndex || currentImageIndex <= 0) {
    return null;
  }

  const decrementIndex = () => {
    setCurrentImageIndex(current => current! - 1);
  };

  return (
    <Link
      className='absolute left-12 top-1/2 -translate-y-3/4 bg-white/40 backdrop-blur-sm rounded-full is-touch-device:opacity-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in'
      onClick={ decrementIndex }
      href={ `/photos/${previousPhotoId}` }
    >
      <LeftChevron />
    </Link>
  );
};

const NextPhotoLink = ({ nextPhotoId }: { nextPhotoId: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useContext(CurrentImageIndexContext);

  if (currentImageIndex == undefined || currentImageIndex < 0) {
    return null;
  }

  const incrementIndex = () => {
    setCurrentImageIndex(current => current! + 1);
  };

  return (
    <Link
      className='absolute right-12 top-1/2 -translate-y-3/4 bg-white/40 backdrop-blur-sm rounded-full is-touch-device:opacity-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in'
      onClick={ incrementIndex }
      href={ `/photos/${nextPhotoId}` }
    >
      <RightChevron />
    </Link>
  );
};

export const ImageNav = ({ _id }: { _id: string }) => {
  const [currentImageIdList, ] = useContext(ImageListContext);
  const [currentImageIndex, setCurrentImageIndex] = useContext(CurrentImageIndexContext);

  if (!setCurrentImageIndex) {
    throw new Error('Image Nav must be used within a context provider');
  }

  useEffect(() => {
    if (currentImageIndex == undefined) {
      // run this indexer since the default is undefined
      const currentIndex = currentImageIdList.indexOf(_id);

      if (currentIndex == -1) {
        // this should rarely happen but may happen if someone has been on the site before and has an img context but then visits a direct link to an image which is not in the current context
        setCurrentImageIndex(undefined);
        return;
      }

      setCurrentImageIndex(currentIndex);
    }

  }, [_id, currentImageIdList, currentImageIndex, setCurrentImageIndex]);

  if (currentImageIndex == undefined) {
    return null;
  }

  const prevId: string | undefined = currentImageIdList[currentImageIndex - 1];
  const nextId: string | undefined = currentImageIdList[currentImageIndex + 1];

  return (
    <>
      { prevId !== undefined && (
        <PreviousPhotoLink previousPhotoId={ prevId } />
      )}
      { nextId !== undefined && (
        <NextPhotoLink nextPhotoId={ nextId } />
      ) }
    </>
  );
};

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