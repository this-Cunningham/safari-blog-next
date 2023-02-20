import { client } from 'src/lib/sanity.client';

import styles from './PhotosByAuthor.module.css';
import { MainImage } from 'src/app/interfaces_blog';
import { ImageTile } from 'src/components/ImageTile';

export default async function PhotosByAuthor ({ params }: { params: { authorSlug: string }}) {
  const photosByAuthor: MainImage[] = await client.fetch(`*[_type == "blogImage"
    && author._ref in *[_type == "author"
    && slug.current == "${params.authorSlug}"]._id]{
      image{asset->},
      caption,
      author->{name}
  }`);

  return (
    <>
      { !photosByAuthor.length && 'No photos'}

      { !!photosByAuthor.length && (
        <div>
          <h2>Photos by { photosByAuthor[0].author?.name }</h2>
          <div className={ styles['photos-by-author-container'] }>
            { photosByAuthor.map(photo => (
              <div key={ photo._id }>
                <ImageTile photo={ photo }/>
                <p>{ photo.caption }</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}