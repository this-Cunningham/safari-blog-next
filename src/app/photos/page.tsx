import { client } from 'src/lib/sanity.client';
import { ImageTile } from 'src/components/ImageTile';

import { MainImage } from '../interfaces_blog';

export default async function Photos () {
  const allPhotos: MainImage[] = await client.fetch(`*[_type == "blogImage"]{
    image{
      asset->
    }
  }`);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Photos</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '16px' }}>
        { allPhotos.map(photo => (
          <>
            <ImageTile photo={ photo } key={ photo._id } />
            <ImageTile photo={ photo } key={ photo._id } />
            <ImageTile photo={ photo } key={ photo._id } />
          </>
        ))}

      </div>
    </div>
  );
}