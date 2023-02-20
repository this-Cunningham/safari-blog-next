import { BlogImage } from 'src/app/interfaces_blog';
import { client } from 'src/lib/sanity.client';

export default async function DisplayImage ({ params }: { params: { photoId: string }}) {
  if (params.photoId == 'by') {
    return <div>Invalid Route: try including author slug, i.e. /by/christopher-cunningham</div>;
  }

  const [{ image, author, caption, imageTags, location }]: BlogImage[] = await client.fetch(`*[_type == "blogImage" && _id == "${params.photoId}"]{
    author->{name, slug},
    image{ asset->{ url } },
    imageTags,
    caption,
    location->{ locationName }
  }`);

  return (
    <>
      <img src={ image.asset.url } alt="" style={{ width: 'auto', maxHeight: '70vh' }}/>
      <p>Photo by: { author.name } { !!location ? ` - Taken in: ${ location?.locationName }`: null}</p>
      <p>{ caption }</p>
      <p>Tags: { imageTags }</p>
    </>
  );
}