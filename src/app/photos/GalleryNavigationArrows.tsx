'use client';

import Link from 'next/link';
import React from 'react';
import { useContext } from 'react';

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
      className='p-4 rounded bg-skyPrimary border-yellowAccent-100'
      onClick={ decrementIndex }
      href={ `/photos/${previousPhotoId}` }
    >
      Previous
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
      className='p-4 rounded bg-skyPrimary border-yellowAccent-100'
      onClick={ incrementIndex }
      href={ `/photos/${nextPhotoId}` }
    >
      Next
    </Link>
  );
};

export const ImageNav = ({ _id }: { _id: string }) => {
  const [currentImageIdList, ] = useContext(ImageListContext);
  const [currentImageIndex, setCurrentImageIndex] = useContext(CurrentImageIndexContext);

  if (!setCurrentImageIndex) {
    throw new Error('Image Nav must be used within a context provider');
  }

  React.useEffect(() => {
      const currentIndex = currentImageIdList.indexOf(_id);

      if (currentIndex == -1) {
        // this should rarely happen but may happen if someone has been on the site before and has an img context but then visits a direct link to an image which is not in the current context
        setCurrentImageIndex(undefined);
        return;
      }

      setCurrentImageIndex(currentIndex);
  }, [_id, currentImageIdList, setCurrentImageIndex]);

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