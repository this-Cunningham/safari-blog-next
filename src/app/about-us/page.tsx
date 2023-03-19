import Link from 'next/link';
import Image from 'next/image';

import { BlogPostBlockContent } from 'src/components/BlogPostBlockContent';
import { urlFor } from 'src/lib/imageUrlBuilder';
import { client } from 'src/lib/sanity.client';
import { Author } from '../interfaces_blog';

const AuthorPanel = ({ author }: { author: Author }) => (
  <div className='space-y-4' key={ author.slug.current }>

    <div className='sm:shrink-0 sm:w-52 sm:float-left sm:mr-4 sm:mb-1'>
      <Image
        className='w-full h-auto'
        src={ urlFor(author.authorImage).quality(100).url() }
        width={ 320 }
        height={ 320 / author.authorImage.asset.metadata.dimensions.aspectRatio }
        placeholder='blur'
        blurDataURL={ author.authorImage.asset.metadata.lqip }
        alt='author image'
      />
    </div>

    <BlogPostBlockContent value={ author.bio } />

    <Link href={ `/about-us/${author.slug.current}/photos` }>
      Photos by { author.name.split(' ')[0] }
    </Link>

    <br />

    <Link href={ `/about-us/${author.slug.current}/blogs`}>
      Blogs by { author.name.split(' ')[0] }
    </Link>
  </div>
);

export default async function AboutUs () {
  const authors: Author[] = await client.fetch(`*[_type == "author"]{
      name,
      slug{ current },
      bio[]{
        _type == 'blogImageRef' => @->{
          caption,
          image{
            ...,
            asset->
          },
          tags[]->{"slug": slug.current, tagName},
        },
        _type == 'imageCollectionRef' => @->{
          _id,
          collectionName,
          collectionImages[]->{
            caption,
            image{
              ...,
              asset->
            },
            tags[]->{"slug": slug.current, tagName},
          },
        },
        _type != 'reference' => @,
      },
      authorImage{ ..., asset-> }
    }`);

  return (
    <>
      <h1 className='text-4xl sm:text-7xl font-serif font-normal mb-4 sm:mb-10'> About </h1>
      <div className='w-full max-w-[720px] mx-auto'>
        <div className='grid grid-rows-[min-content] gap-8'>
          { authors.map(author => (
            <AuthorPanel author={ author } key={ author.slug.current } />
          )) }
        </div>
      </div>
    </>
  );
}