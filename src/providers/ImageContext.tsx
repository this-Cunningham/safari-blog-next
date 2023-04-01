'use client';

import React from 'react';
import { registerServiceWorker } from 'src/lib/registerServiceworker';

type BlogImageId = string;

export const ImageListContext = React.createContext<[
  BlogImageId[],
  React.Dispatch<React.SetStateAction<string[]>>
]>(undefined!);

export const CurrentImageIndexContext = React.createContext<[
  number | undefined, (React.Dispatch<React.SetStateAction<number| undefined>>)
]>(undefined!);

const LOCAL_STORAGE_ID_LIST_KEY = 'currentImageIdList';

export const ImageContextProvider = ({ children, imageIdList }: { children: React.ReactNode; imageIdList: BlogImageId[] }) => {
  const [currentImageIdList, setCurrentImageIdList] = React.useState(imageIdList);
  const [currentImageIndex, setCurrentImageIndex] = React.useState<number | undefined>();

  React.useEffect(() => {
    registerServiceWorker();
    const idList = localStorage.getItem(LOCAL_STORAGE_ID_LIST_KEY);
    // this is for page reloads while browsing image... want to maintain img context if there is one...
    // otherwise we want to default to the initial img ID list we load into context
    if (idList !== null) {
      setCurrentImageIdList(JSON.parse(idList) as string[]);
    }
  }, []);

  // consider memoizing the new arrays we create and pass to "value" with React.useMemo

  return (
    <ImageListContext.Provider value={ [currentImageIdList, setCurrentImageIdList] }>
      <CurrentImageIndexContext.Provider value={ [currentImageIndex, setCurrentImageIndex] }>
        { children }
      </CurrentImageIndexContext.Provider>
    </ImageListContext.Provider>
  );
};

export const LoadImageContext = ({ imageIdList }: {imageIdList: BlogImageId[] }) => {
  const [, setCurrentImageIdList] = React.useContext(ImageListContext);

  React.useEffect(() => {
    if (!setCurrentImageIdList) {
      throw new Error('LoadImageContext must be used within a context provider');
    };

    setCurrentImageIdList(imageIdList);
    localStorage.setItem(LOCAL_STORAGE_ID_LIST_KEY, JSON.stringify(imageIdList));

  }, [imageIdList, setCurrentImageIdList]);

  return null;
};