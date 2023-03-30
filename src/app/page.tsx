import Image from 'next/image';
import { BlueButtonLink } from 'src/components/atoms/BlueButtonLink';
import { Subheadline } from 'src/components/atoms/TextAtoms';

import { LatestPosts } from 'src/components/BlogPostTile';
import { urlFor } from 'src/lib/imageHelpers';
import { client } from 'src/lib/sanity.client';
import { BlogImage } from './interfaces_blog';

export default async function Home() {
  const heroImage: BlogImage = await client.fetch(`//groq
    *[_id == 'edf1aa5d-9cfd-4bb3-8a64-66d3074bd932'][0]{
      ...,
      image{
        asset->,
      },
      location->,
    }
  `);

  return (
    <>
      <div
        style={{
          backgroundImage: `url("${urlFor(heroImage.image).width(1800).quality(100).auto('format').url()}")`
        }}
        className='
          relative
          rounded
          h-[calc(100vh-64px)] sm:h-[calc(100vh-112px)]
          bg-cover bg-no-repeat bg-center
          top-0 bottom-0 left-0 -right-[88px] sm:right-0'
      >
      </div>

      <div className='bg-white p-4 sm:p-12'>
        <Subheadline className='mt-2'>Life aboard a Ted Hood Classic</Subheadline>

        <div className="flex flex-col sm:flex-row gap-6 justify-between w-full h-full">

          <div className='flex flex-col font-sans h-auto justify-evenly gap-6 sm:w-2/5 lg:text-2xl text-center sm:text-left'>
            <p>
              Purchased in 2007, weve modified our vessel over the last 16 years, and have been cruising Maine and the Bahamas since 2014.
              <br />
              <br />
              Read more about our vessel, and how weve upgraded it
            </p>
            <BlueButtonLink href='/about-us'>
              About&nbsp;Safari
            </BlueButtonLink>
          </div>

          <div className='sm:w-3/5 my-auto'>
            <Image src='/safari-blueprint.png'
              className='w-full h-auto bg-gray-500 text-yellowAccent-200'
              height={ 400 }
              width={ 600 }
              alt='safari blueprint'
            />
          </div>
        </div>

      </div>

      <div className='px-4 sm:px-12'>
        {/* @ts-expect-error Server Component */}
        <LatestPosts />
      </div>
    </>
  );
}
