import { client } from 'src/lib/sanity.client';

import styles from './PhotosByAuthor.module.css';
import { BlogImage } from 'src/app/interfaces_blog';
import { ImageTileList } from 'src/components/ImageTile';

export default async function PhotosByAuthor ({ params }: { params: { authorSlug: string }}) {
  const photosByAuthor: BlogImage[] = await client.fetch(`
    *[_type == "blogImage"
    && author._ref in *[_type == "author"
    && slug.current == "${params.authorSlug}"]._id]{
      _id,
      image{asset->},
      caption,
      author->{name}
    }
  `);

  return (
    <>
      { !photosByAuthor.length && 'No photos'}

      { !!photosByAuthor.length && (
        <>
          <h2 className={ styles.header }>Photos by { photosByAuthor[0].author?.name }</h2>
          <ImageTileList photos={ photosByAuthor } />
        </>
      )}
    </>
  );
}