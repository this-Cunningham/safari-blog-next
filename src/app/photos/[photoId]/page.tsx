import { BlogImage } from 'src/app/interfaces_blog';
import { ImageWrapper } from 'src/components/ImgWrapper';
import { client } from 'src/lib/sanity.client';

export default async function DisplayImage ({ params }: { params: { photoId: string }}) {
  const blogImages: BlogImage[] = await client.fetch(`
    *[_type == "blogImage" && _id == "${params.photoId}"]{
      author->{name, slug},
      image{ asset->{ url } },
      imageTags,
      caption,
      location->{ locationName }
    }
  `);

  return (
    <>
      { blogImages.map(({ image, author, location, caption, imageTags }) => (
        <>
          <ImageWrapper src={ image.asset.url } alt="" style={{ width: 'auto', maxHeight: '70vh' }} />
          <p>Photo by: { author.name } { !!location ? ` - Taken in: ${ location?.locationName }`: null}</p>
          <p>{ caption }</p>
          <p>Tags: { imageTags }</p>
        </>
      ))}
    </>
  );
}