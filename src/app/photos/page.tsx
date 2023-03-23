import { client } from 'src/lib/sanity.client';
import { ImageTileList } from 'src/components/ImageTile';

import { BlogImage } from 'src/app/interfaces_blog';
import { SiteSectionHeader } from 'src/components/atoms/SiteSectionHeader';

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
      <SiteSectionHeader>Gallery</SiteSectionHeader>
      <ImageTileList photos={ allPhotos } />
    </>
  );
}