import { client } from './sanity.client';
import imageUrlBuilder from '@sanity/image-url';

import { BlogImage } from 'src/app/interfaces_blog';

const builder = imageUrlBuilder(client);

export const urlFor = function urlFor(source: any) {
  return builder.image(source);
};

export const addPreviousAndNextIdToPhotos = (photos: BlogImage[]) => {
  return photos.map((photo, index) => ({
    ...photo,
    nextPhotoId: photos[index + 1]?._id ?? photos[0]._id,
    previousPhotoId: photos[index - 1]?._id ?? photos[photos.length - 1]._id,
  }));
};