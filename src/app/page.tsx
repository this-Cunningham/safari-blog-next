import { urlFor } from 'src/lib/imageUrlBuilder';
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
    <div
      style={{ backgroundImage: `url("${urlFor(heroImage.image).quality(100).url()}")` }}
      className='
        bg-cover bg-no-repeat bg-center fixed
        top-12 sm:top-0 bottom-0 left-0 -right-[88px] sm:right-0
      '
    >
    </div>
  );
}
