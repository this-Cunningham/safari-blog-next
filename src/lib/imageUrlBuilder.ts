import { client } from './sanity.client';
// eslint-disable-next-line import/no-extraneous-dependencies
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

export const urlFor = function urlFor(source: any) {
  return builder.image(source);
};