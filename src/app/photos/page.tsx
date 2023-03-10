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
    <ImageTileList photos={ allPhotos } />
  );
}