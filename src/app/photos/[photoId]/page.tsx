import { BlogImage } from 'src/app/interfaces_blog';
import { ImageWrapper } from 'src/components/ImgWrapper';
import { Tag } from 'src/components/Tag';
import { client } from 'src/lib/sanity.client';

export default async function DisplayImage ({ params }: { params: { photoId: string }}) {
  const blogImages: BlogImage[] = await client.fetch(`//groq
    *[_type == "blogImage" && _id == "${params.photoId}"]{
      author->{name, slug},
      image{ ..., asset-> },
      tags[]->{"slug": slug.current, tagName},
      caption,
      location->{ locationName }
    }
  `);

  return (
    <>
      { blogImages.map(({ image, author, location, caption, tags }) => (
        <>
          <ImageWrapper src={ image.asset.url } alt="" style={{ width: '100%' }} />
          <p>Photo by: { author.name } { !!location ? ` - Taken in: ${ location?.locationName }`: null}</p>
          <p>{ caption }</p>
          { tags && tags.length && (
            <>
              Tags: {' '}
              { tags.map(tag => <Tag tag={ tag } key={ tag.slug } /> )}
            </>
          )}
        </>
      ))}
    </>
  );
}