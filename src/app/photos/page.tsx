import { client } from 'src/lib/sanity.client';
import { ImageTile } from 'src/components/ImageTile';

import { BlogImage } from '../interfaces_blog';

export default async function Photos () {
  const allPhotos: BlogImage[] = await client.fetch(`*[_type == "blogImage"]{
    _id,
    image{
      asset->
    },
    caption,
  }`);

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Photos</h1>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '16px' }}>
        { allPhotos.map(photo => (
          <ImageTile photo={ photo } key={ photo._id } />
        ))}
      </div>
    </>
  );
}