import { MainImage } from 'src/app/interfaces_blog';
import { client } from 'src/lib/sanity.client';

export default async function PhotosByAuthor ({ params }: { params: { authorSlug: string }}) {
  const photosByAuthor: Partial<MainImage>[] = await client.fetch(`*[_type == "blogImage"
    && author._ref in *[_type == "author"
    && slug.current == "${params.authorSlug}"]._id]{
      image{asset->},
      caption,
      author->{name}
  }`);

  return (
    <div className=''>
      { !photosByAuthor.length && 'No photos'}
      { !!photosByAuthor.length && (
        <>
        <h2>Photos by { photosByAuthor[0].author?.name }</h2>
          { photosByAuthor.map(photo => (
            <div key={ photo._id } style={{ width: '30%'}}>
              <img src={ photo.image?.asset.url } alt={ photo.caption } />
              <p>{ photo.caption }</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}