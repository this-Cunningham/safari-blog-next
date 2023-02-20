import { MainImage } from 'src/app/interfaces_blog';
import { client } from 'src/lib/sanity.client';

export default async function DisplayImage ({ params }: { params: { photoId: string }}) {
  const [{ image, author, caption, imageTags }]: MainImage[] = await client.fetch(`*[_type == "blogImage" && _id == "${params.photoId}"]{
    author->{name, slug},
    image{ asset->{ url } },
    imageTags,
    caption
  }`);

  return (
    <>
      <img src={ image.asset.url } alt="" style={{ width: 'auto', maxHeight: '70vh' }}/>
      <p>Photo by: { author.name }</p>
      <p>{ caption }</p>
      <p>Tags: { imageTags }</p>
    </>
  );
}