import { client } from 'src/lib/sanity.client';
import { ImageTileList } from 'src/components/ImageTile';

import { BlogImage } from '../interfaces_blog';

export default async function Photos () {
  const allPhotos: BlogImage[] = await client.fetch(`*[_type == "blogImage"]{
    _id,
    image{
      ...,
      asset->
    },
    caption,
  }`);

  return (
    <>
      <h1 className='text-4xl sm:text-7xl font-serif font-normal mb-4 sm:mb-10'> Gallery </h1>
      <ImageTileList photos={ allPhotos } />
    </>
  );
}