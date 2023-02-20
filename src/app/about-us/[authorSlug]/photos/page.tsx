import { client } from 'src/lib/sanity.client';

import styles from './PhotosByAuthor.module.css';
import { BlogImage } from 'src/app/interfaces_blog';
import { ImageTile } from 'src/components/ImageTile';

export default async function PhotosByAuthor ({ params }: { params: { authorSlug: string }}) {
  console.log(params)
  const photosByAuthor: BlogImage[] = await client.fetch(`*[_type == "blogImage"
    && author._ref in *[_type == "author"
    && slug.current == "${params.authorSlug}"]._id]{
      _id,
      image{asset->},
      caption,
      author->{name}
  }`);

  return (
    <>
      { !photosByAuthor.length && 'No photos'}

      { !!photosByAuthor.length && (
        <>
          <h2 className={ styles.header }>Photos by { photosByAuthor[0].author?.name }</h2>
          <div className={ styles['photos-by-author-container'] }>
            { photosByAuthor.map(photo => (
              <div key={ photo._id } className={ styles.photoWrapper }>
                <ImageTile photo={ photo } />
                <p className={ styles.photoCaption }>{ photo.caption }</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}