import { client } from 'src/lib/sanity.client';
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
          <img src={photo.image.asset.url} alt="" key={ photo._id }
            style={{ maxWidth: '300px', maxHeight: '150px', borderRadius: '8px'}} />
        ))}
        { allPhotos.map(photo => (
          <img src={photo.image.asset.url} alt="" key={ photo._id }
            style={{ maxWidth: '300px', maxHeight: '150px', borderRadius: '8px'}} />
        ))}
        { allPhotos.map(photo => (
          <img src={photo.image.asset.url} alt="" key={ photo._id }
            style={{ maxWidth: '300px', maxHeight: '150px', borderRadius: '8px'}} />
        ))}
      </div>
    </div>
  );
}